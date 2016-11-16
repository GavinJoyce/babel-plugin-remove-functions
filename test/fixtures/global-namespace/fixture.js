import Em from 'ember';

Ember.assert('this will be removed');
Ember.deprecate('this will be removed', test);
Ember.assert('this will be removed', test);

Em.debug('this will NOT be removed');
warn('this will NOT be removed');
info('this will NOT be removed');

console.log(message);
