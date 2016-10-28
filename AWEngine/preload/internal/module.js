'use strict';

exports = module.exports = {
  makeRequireFunction,
  stripBOM,
  requireDepth: 0
};

function makeRequireFunction() {
  var Module  = this.constructor,
      require = (function (path) {
        try {
          exports.requireDepth++;
          return this.require(path);
        } finally {
          exports.requireDepth--;
        }
      }).bind(this);

  require.resolve = (function (request) {
    Module._resolveFilename(request, self);
  }).bind(this);

  require.extensions = Module._extensions;
  require.cache = Module._cache;

  return require;
}

function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  return content;
}
