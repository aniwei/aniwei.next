var app       = require('app'),
    native    = app.native,
    protocol  = native.URLProtocol.sharedURLProtocol();

module.exports = {
  canInitWithRequest: function (handler) {
    protocol.canInitWithRequest(handler);

    return this;
  }
}
