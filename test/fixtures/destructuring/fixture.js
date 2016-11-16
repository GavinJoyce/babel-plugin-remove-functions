const {
  assert,
  deprecate
} = Ember;

const { debug } = Ember;

const { warn: renamedWarn } = Ember;

const { doSomething } = OtherThing;

deprecate('this will be removed', test);
assert('this will be removed', test);
debug('this will be removed');
renamedWarn('this will be removed');
doSomething('this will be removed');

warn('this will NOT be removed');
info('this will NOT be removed');

console.log(message);
