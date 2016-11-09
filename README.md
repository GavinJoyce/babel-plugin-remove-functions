# babel-plugin-remove-functions

https://travis-ci.org/GavinJoyce/babel-plugin-remove-functions.svg?branch=master

This is a WIP and experimental implementation of https://github.com/ember-cli/rfcs/pull/50.

Given the following configuration:

```js
{
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
}
```

And the following source javascript:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    console.log('didInsertElement');

    Ember.isEqual('this will not be removed', 'ok?');

    Ember.assert('this will be removed');
    Ember.assert('this will also be removed', true);

    Ember.debug('this will be removed');

    Ember.deprecate(
      'this will be removed',
      false,
      {
        id: 'test-deprecation',
        until: '3.0.0',
        url: 'http://foo.com'
      }
    );

    Ember.info('this will be removed');

    Ember.runInDebug(() => {
      Ember.Component.reopen({
        didInsertElement() {
          console.log('this will all be removed');
        }
      });
    });

    Ember.warn('this will be removed');
  }
});
```

The output will be:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    console.log('didInsertElement');

    Ember.isEqual('this will not be removed', 'ok?');
  }
});
```
---

This is based on [babel-plugin-filter-imports](https://github.com/ember-cli/babel-plugin-filter-imports) by [mmum](https://github.com/mmun).
