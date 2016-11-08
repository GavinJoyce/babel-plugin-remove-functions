# babel-plugin-remove-functions

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
    Ember.debug('didInsertElement');
  }
});
```

The output will be:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    console.log('didInsertElement');
  }
});
```
---

This is based on [babel-plugin-filter-imports](https://github.com/ember-cli/babel-plugin-filter-imports) by [mmum](https://github.com/mmun).
