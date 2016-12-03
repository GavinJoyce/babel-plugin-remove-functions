'use strict';

var stringify = require('json-stable-stringify');

module.exports = function (options) {
  function plugin(babel) {
    var types = babel.types;
    var callPathsToRemove;

    return new babel.Transformer('babel-plugin-remove-functions', {
      Program: {
        enter: function enter() {
          callPathsToRemove = [];
          options.removals.forEach(function (removal) {
            if (removal.global) {
              removal.methods.forEach(function (method) {
                callPathsToRemove.push(removal.global + '.' + method);
              });
            }
          });
        },
        exit: function exit() {
          callPathsToRemove = undefined;
        }
      },

      VariableDeclaration: function VariableDeclaration(node) {
        node.declarations.forEach(function (declaration) {
          if (declaration.init) {
            var importName = declaration.init.name; //eg. `Ember` (from `const { debug } = Ember;`)

            options.removals.forEach(function (removal) {
              if (removal.module === importName) {
                if (declaration.id && declaration.id.properties) {
                  declaration.id.properties.forEach(function (property) {
                    //eg. const { warn: renamedWarn } = Ember;
                    //    =>: property.key.name => 'warn'
                    //    =>: property.value.name => 'renamedWarn'
                    if (removal.methods.indexOf(property.key.name) !== -1) {
                      callPathsToRemove.push(property.value.name);
                    }
                  });
                }
              }
            });
          }
        });
      },

      ImportDeclaration: function ImportDeclaration(node) {
        options.removals.forEach(function (removal) {
          if (types.isLiteral(node.source, { value: removal.module })) {
            var firstNode = node.specifiers && node.specifiers[0];
            if (types.isImportDefaultSpecifier(firstNode)) {
              removal.methods.forEach(function (method) {
                callPathsToRemove.push(firstNode.local.name + '.' + method);
              });
            }
          }
        });
      },

      CallExpression: function CallExpression(node) {
        if (callPathsToRemove.length === 0) {
          return;
        }

        if (node.callee.type === 'MemberExpression') {
          var callPath = getCallPath(node.callee);

          if (callPathsToRemove.indexOf(callPath) !== -1) {
            this.dangerouslyRemove();
          }
        }
      },

      ExpressionStatement: function ExpressionStatement(node) {
        if (callPathsToRemove.length === 0) {
          return;
        }

        if (!node.expression.callee) {
          return;
        }

        if (callPathsToRemove.indexOf(node.expression.callee.name) !== -1) {
          this.dangerouslyRemove();
        }
      }
    });
  };

  plugin.baseDir = function () {
    return __dirname;
  };

  plugin.cacheKey = function () {
    return stringify(options);
  };

  return plugin;
};

function getCallPath(node) {
  var leftSide = '';
  if (node.object.type === 'Identifier') {
    leftSide = node.object.name;
  } else {
    if (node.object.type === 'MemberExpression') {
      leftSide = getCallPath(node.object);
    };
  }

  return leftSide + '.' + node.property.name;
}