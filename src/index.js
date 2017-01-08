import State from './state';

var stringify = require('json-stable-stringify');

module.exports = function(options) {
  function plugin(babel) {
    let state = new State(options);
    var types = babel.types;
    var callPathsToRemove;

    return new babel.Transformer('babel-plugin-remove-functions', {
      Program: {
        enter() {
          state.enter();
        },
        exit() {
          state.exit();
        }
      },

      ImportDeclaration: function(node) {
        node.specifiers.forEach((specifier) => {
          state.importSpecifier(specifier.type, node.source.value, specifier.local.name);
        });
      },

      ExpressionStatement: function(node) {
        if(!node.expression.callee || !node.expression.callee.name) {
          return;
        }

        let callPath = node.expression.callee.name;
        if(state.showRemoveCallPath(callPath)) {
          this.dangerouslyRemove();
        }
      },

      CallExpression: function(node) {
        if(node.callee.type === 'MemberExpression') {
          let callPath = getCallPath(node.callee);

          if(state.showRemoveCallPath(callPath)) {
            this.dangerouslyRemove();
          }
        }
      },

      VariableDeclaration: function(node) {
        //TODO: GJ: move some of this into State

        //eg. `const { assert, deprecate } = Ember;`
        node.declarations.forEach((declaration) => {
          if(declaration.init) {
            let importSource = state.getImportSourceFromLocal(declaration.init.name);

            options.removals.forEach((removal) => {
              if(removal.module === importSource) {

                if(declaration.id && declaration.id.properties) {
                  declaration.id.properties.forEach((property) => {
                    //eg. const { warn: renamedWarn } = Ember;
                    //    =>: property.key.name => 'warn'
                    //    =>: property.value.name => 'renamedWarn'
                    if(removal.paths.indexOf(property.key.name) !== -1) {
                      state.callPathsToRemove.add(property.value.name);
                    }
                  });
                }
              }
            });
          }
        });
      }

    });
  };

  plugin.baseDir = function() {
    return __dirname;
  };

  plugin.cacheKey = function() {
    return stringify(options);
  };

  return plugin;
};

function getCallPath(node) {
  var leftSide = '';
  if(node.object.type === 'Identifier') {
    leftSide = node.object.name;
  } else {
    if(node.object.type === 'MemberExpression') {
      leftSide = getCallPath(node.object);
    };
  }

  return `${leftSide}.${node.property.name}`;
}
