var stringify = require('json-stable-stringify');

module.exports = function(options) {
  function plugin(babel) {
    var types = babel.types;
    var callPathsToRemove = [];

    return new babel.Transformer('babel-plugin-remove-functions', {
      ImportDeclaration: function(node) {
        options.removals.forEach(function(removal) {
          if(types.isLiteral(node.source, { value: removal.import })) {
            var firstNode = node.specifiers && node.specifiers[0];
            if(types.isImportDefaultSpecifier(firstNode)) {
              removal.methods.forEach(function(method) {
                callPathsToRemove.push(firstNode.local.name + '.' + method);
              });
            }
          }
        });
      },

      CallExpression: function(node) {
        if(node.callee.type === 'MemberExpression') {
          var callPath = getCallPath(node.callee);

          if(callPathsToRemove.indexOf(callPath) !== -1) {
            this.dangerouslyRemove();
          }
        }
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

  return leftSide + '.' + node.property.name;
}
