import Ember from 'ember';

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

Ember.isEqual('this will not be removed', 'ok?');
