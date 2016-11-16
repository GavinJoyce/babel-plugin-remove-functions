var assert = require('assert');
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var plugin = require('../index');

function testFixture(name, options) {
  it(name, function () {
    var fixturePath = path.resolve(__dirname, 'fixtures', name, 'fixture.js');
    var expectedPath = path.resolve(__dirname, 'fixtures', name, 'expected.js');

    var expected = fs.readFileSync(expectedPath).toString();
    var result = babel.transformFileSync(fixturePath, {
      blacklist: ['strict'],
      modules: 'commonStrict',
      plugins: [plugin(options)]
    });

    assert.strictEqual(expected.trim(), result.code.trim());
  });
}

describe('babel-plugin-remove-functions', function() {
  testFixture('default', {
    removals: [
      {
        module: 'ember',
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

  testFixture('no-methods', {
    removals: [
      {
        module: 'ember',
        methods: []
      }
    ]
  });

  testFixture('destructuring', {
    removals: [
      {
        module: 'Ember',
        methods: ['assert', 'deprecate', 'debug', 'warn']
      },
      {
        module: 'OtherThing',
        methods: ['doSomething']
      }
    ]
  });

  testFixture('global-namespace', {
    removals: [
      {
        global: 'Ember',
        methods: ['assert', 'deprecate', 'debug', 'warn']
      }
    ]
  });

  testFixture('kitchen-sink', {
    removals: [
      {
        global: 'Ember',
        methods: ['assert', 'deprecate', 'debug', 'warn']
      }
    ]
  });

  it('provides a baseDir', function() {
    var expectedPath = path.join(__dirname, '..');

    var instance = plugin({ assert: ['default'] });

    assert.equal(instance.baseDir(), expectedPath);
  });

  it('includes options in `cacheKey`', function() {
    var first = plugin({ assert: ['default'] });
    var second = plugin({ assert: ['assert'] });

    assert.notEqual(first.cacheKey(), second.cacheKey());
  });
});
