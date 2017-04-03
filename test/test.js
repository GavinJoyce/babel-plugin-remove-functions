var assert = require('assert');
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var plugin = require('../lib/index');

function testFixtureWithPlugins(name, plugins) {
  it(name, function () {
    var fixturePath = path.resolve(__dirname, 'fixtures', name, 'fixture.js');
    var expectedPath = path.resolve(__dirname, 'fixtures', name, 'expected.js');

    var expected = fs.readFileSync(expectedPath).toString();
    var result = babel.transformFileSync(fixturePath, {
      babelrc: false,
      plugins: plugins
    });

    assert.strictEqual(result.code.trim(), expected.trim());
  });
}

function testFixture(name, options) {
  testFixtureWithPlugins(name, [
    [plugin, options]
  ]);
}

describe('babel-plugin-remove-functions', function() {
  testFixture('default', {
    removals: [
      {
        module: 'ember',
        paths: [
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
        paths: []
      }
    ]
  });

  testFixture('destructuring', {
    removals: [
      {
        module: 'ember',
        paths: ['assert', 'deprecate', 'debug', 'warn']
      },
      {
        module: 'other-thing',
        paths: ['doSomething']
      }
    ]
  });

  testFixture('global-namespace', {
    removals: [
      {
        global: 'Ember',
        paths: ['assert', 'deprecate', 'debug', 'warn']
      }
    ]
  });

  testFixture('kitchen-sink', {
    removals: [
      {
        global: 'Ember',
        paths: ['assert', 'deprecate', 'debug', 'warn']
      }
    ]
  });

  //TODO: GJ: reenable these tests
  // it('provides a baseDir', function() {
  //   var expectedPath = path.join(__dirname, '../');
  //
  //   var instance = plugin({ assert: ['default'] });
  //
  //   assert.equal(instance.baseDir(), expectedPath);
  // });
  //
  // it('includes options in `cacheKey`', function() {
  //   var first = plugin({ assert: ['default'] });
  //   var second = plugin({ assert: ['assert'] });
  //
  //   assert.notEqual(first.cacheKey(), second.cacheKey());
  // });
});
