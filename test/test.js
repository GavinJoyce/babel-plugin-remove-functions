var assert = require('assert');
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var codeRemoval = require('../index');

function testFixture(name, options) {
  it(name, function () {
    var fixturePath = path.resolve(__dirname, 'fixtures', name, 'fixture.js');
    var expectedPath = path.resolve(__dirname, 'fixtures', name, 'expected.js');

    var expected = fs.readFileSync(expectedPath).toString();
    var result = babel.transformFileSync(fixturePath, {
      blacklist: ['strict'],
      modules: 'commonStrict',
      plugins: [codeRemoval(options)]
    });

    assert.strictEqual(result.code.trim(), expected.trim());
  });
}

describe('babel-plugin-remove-functions', function() {
  testFixture('default', {
    enabled: true,
    removals: [
      {
        import: 'ember',
        methods: [
          'assert',
          'debug',
          'deprecate',
          'info',
          'runInDebug',
          'warn'
        ]
      }
    ]
  });
});
