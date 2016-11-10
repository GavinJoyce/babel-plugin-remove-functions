import Ember from 'ember';

Ember.assert('this will remain');
Ember.assert('this will remain', true);

Ember.debug('this will remain');

Ember.deprecate(
  'this will remain',
  false,
  {
    id: 'test-deprecation',
    until: '3.0.0',
    url: 'http://foo.com'
  }
);

Ember.info('this will remain');

Ember.runInDebug(() => {
  Ember.Component.reopen({
    didInsertElement() {
      console.log('this will all remain');
    }
  });
});

Ember.warn('this will remain');

Ember.isEqual('this will remain', 'ok?');
