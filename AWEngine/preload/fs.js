var path    = require('path'),
    app     = require('app');

var exports = module.exports = {
  stat: app.stat,
  existsSync: app.existsSync
};

exports.readFileSync = function (filePath) {
  if (!path.isAbsolute) {
    throw new Error('file path must be a absolute path');
  }

  if (!exports.existsSync(filePath)) {
    throw new Error('file is not exists');
  }

  return app.readFileSync(filePath)
}
