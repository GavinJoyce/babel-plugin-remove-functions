import Ember from 'ember';

const {
  assert,
  deprecate
} = Ember;

const { debug } = Ember;

const { warn: renamedWarn } = Ember;

import OtherThing from 'other-thing';

const { doSomething } = OtherThing;

warn('this will NOT be removed');
info('this will NOT be removed');

console.log(message);
