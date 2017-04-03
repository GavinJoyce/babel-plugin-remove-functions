let path = require('path');
let stringify = require('json-stable-stringify');

module.exports = function({ types }) {
  let configuration;
  let callPathsToRemove = new Set();
  let importLocalToSourceMap = new Map();

  let shouldRemoveCallPath = (path) => {
    return callPathsToRemove.has(path);
  };

  let getImportSourceFromLocal = (local) => {
    // eg. `import Ember from 'ember';`
    // 'ember' is the source
    // 'Ember' is the local
    return importLocalToSourceMap[local];
  }

  return {
    visitor: {
      Program: {
        enter(path, s) {
          configuration = s.opts;

          callPathsToRemove.clear();
          importLocalToSourceMap.clear();

          //TODO: GJ: PERF: construct this once and reuse
          configuration.removals.forEach(removal => {
            if(removal.global) {
              removal.paths.forEach(method => callPathsToRemove.add(`${removal.global}.${method}`));
            }
          });
        },

        exit() {

        }
      },

      ImportDeclaration: function(path) {
        let node = path.node;

        node.specifiers.forEach((specifier) => {
          let type = specifier.type;

          if(type === 'ImportDefaultSpecifier') {
            let source = node.source.value;
            let local = specifier.local.name;

            importLocalToSourceMap[local] = source;

            configuration.removals.forEach(removal => {
              if(removal.module === source) {
                removal.paths.forEach(method => callPathsToRemove.add(`${local}.${method}`));
              }
            });
          }
        });
      },

      ExpressionStatement: function(path) {
        let node = path.node;
        if(!node.expression.callee || !node.expression.callee.name) {
          return;
        }

        let callPath = node.expression.callee.name;

        if(shouldRemoveCallPath(callPath)) {
          path.remove();
        }
      },

      CallExpression: function(path) {
        let node = path.node;

        if(node.callee.type === 'MemberExpression') {
          let callPath = getCallPath(node.callee);

          if(shouldRemoveCallPath(callPath)) {
            path.remove();
          }
        }
      },

      //eg. `const { assert, deprecate } = Ember;`
      VariableDeclaration: function(path, s) {
        let node = path.node;

        node.declarations.forEach((declaration) => {
          if(declaration.init) { //does it have an
            let importSource = getImportSourceFromLocal(declaration.init.name);

            configuration.removals.forEach((removal) => {
              if(removal.module === importSource) {

                if(declaration.id && declaration.id.properties) {
                  declaration.id.properties.forEach((property) => {
                    //eg. const { warn: renamedWarn } = Ember;
                    //    =>: property.key.name => 'warn'
                    //    =>: property.value.name => 'renamedWarn'
                    if(removal.paths.indexOf(property.key.name) !== -1) {
                      callPathsToRemove.add(property.value.name);
                    }
                  });
                }
              }
            });
          }
        });
      }

    }
  };
};

module.exports.baseDir = function() { return path.join(__dirname, '../'); };
// module.exports.cacheKey = function() { return stringify(options); };

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
