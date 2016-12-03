var _ember = require('ember');

var _otherThing = require('other-thing');

var assert = _ember['default'].assert;
var deprecate = _ember['default'].deprecate;
var debug = _ember['default'].debug;
var renamedWarn = _ember['default'].warn;
var doSomething = _otherThing['default'].doSomething;

warn('this will NOT be removed');
info('this will NOT be removed');

console.log(message);
