var _ember = require('ember');

_ember['default'].assert('this will remain');
_ember['default'].assert('this will remain', true);

_ember['default'].debug('this will remain');

_ember['default'].deprecate('this will remain', false, {
  id: 'test-deprecation',
  until: '3.0.0',
  url: 'http://foo.com'
});

_ember['default'].info('this will remain');

_ember['default'].runInDebug(function () {
  _ember['default'].Component.reopen({
    didInsertElement: function didInsertElement() {
      console.log('this will all remain');
    }
  });
});

_ember['default'].warn('this will remain');

_ember['default'].isEqual('this will remain', 'ok?');
