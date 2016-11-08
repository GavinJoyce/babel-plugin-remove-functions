var stringify = require('json-stable-stringify');

module.exports = function(options) {
  function babelPluginFilterImports(babel) {
    var types = babel.types;
    var callPathsToRemove = [];

    return new babel.Transformer('babel-plugin-remove-functions', {
      ImportDeclaration: function(node) {
        options.removals.forEach(function(removal) {
          if(types.isLiteral(node.source, { value: removal.import })) {
            let firstNode = node.specifiers && node.specifiers[0];
            if(types.isImportDefaultSpecifier(firstNode)) {
              removal.methods.forEach((method) => {
                callPathsToRemove.push(`${firstNode.local.name}.${method}`);
              });
            }
          }
        });
      },

      CallExpression: function(node) {
        if(node.callee.type === 'MemberExpression') {
          let callPath = getCallPath(node.callee);

          if(callPathsToRemove.includes(callPath)) {
            this.dangerouslyRemove();
          }
        }
      }
    });
  };

  babelPluginFilterImports.baseDir = function() {
    return __dirname;
  };

  babelPluginFilterImports.cacheKey = function() {
    return stringify(options);
  };

  return babelPluginFilterImports;
};

function getCallPath(node) {
  let leftSide = '';
  if(node.object.type === 'Identifier') {
    leftSide = node.object.name;
  } else {
    if(node.object.type === 'MemberExpression') {
      leftSide = getCallPath(node.object);
    };
  }

  return `${leftSide}.${node.property.name}`;
}
