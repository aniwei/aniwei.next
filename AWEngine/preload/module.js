'use strict';

const NativeModule = require('native_module');
const internalModule = require('internal/module');
const app = require('app');
const path = require('path');
const fs = require('fs');



var fileManager = {
  cache: new Map,
  stat: function (filename) {
    var cache = this.cache.get('stat'),
        result

    if (!cache) {
      this.cache.set('stat', cache = new Map)
    }

    result = cache.get('filename');

    if (result) {
      return result;
    }

    result = fs.stat(filename);
    cache.set(filename, result);

    return result
  },
  readFileSync: fs.readFileSync
}


function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}


function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;

  if (parent && parent.children) {
    parent.children.push(this);
  }

  this.filename = null;
  this.loaded = false;
  this.children = [];
}

Module._cache = {};
Module._pathCache = {};
Module._extensions = {};

var modulePaths = [];

Module.globalPaths = [];


const packageMainCache = {};

var packageFile = {
  cache: {},
  read: function (request) {
    var cache     = this.cache,
        jsonPath  = path.resolve(request, 'package.json'),
        json,
        entry;

    if (hasOwnProperty(this.cache, request)) {
      return cache[requestPath];
    }

    json = fileManager.readFileSync(jsonPath);

    if (json) {
      try {
        entry = cache[request] = JSON.parse(json).main
      } catch (e) {
        e.path = jsonPath;
        e.message = 'Error parsing ' + jsonPath + ': ' + e.message;

        throw e;
      }
    }

    return entry;
  },
  tryPackage: function (request, exts, isMain) {
    var entry = this.read(request),
        filename;

    if (entry) {
      filename = path.resolve(request, entry);
    }

    return filename;
  }
}

Module._findPath = function(request, paths, isMain) {
  var manager   = fileManager,
      pack      = packageFile,
      trailing  = request.length == 1 && request[0] == '/',
      filename,
      extension,
      key;

  if (!paths || !paths.length) {
    return false;
  }

  if (path.isAbsolute(request)) {
    paths = [''];
  }

  key       = JSON.stringify({request: request, paths: paths});
  extension = Object.keys(Module._extensions);

  if (Module._pathCache[key]) {
    return Module._pathCache[key];
  }

  paths.some(function(cur, i){
    var basePath,
        filePath,
        code;

    if (cur) {
      if (manager.stat(cur) < 1) {
        return this;
      }
    }

    basePath = path.resolve(cur, request);

    if (!trailing) {
      code = manager.stat(basePath);

      if (code === 0) {
        filePath = basePath;
      }
    }

    if (!filePath) {
      filePath = pack.tryPackage(basePath, extension, isMain);
    }

    if (!filePath) {
      filePath = path.resolve(basePath, 'index.js');
    }

    if (filePath) {
      return filename = filePath;
    }
  });

  if (filename) {
    Module._pathCache[key] = filename;
  }

  return filename;
};

Module._nodeModulePaths = function (from) {
  var result  = [],
      env     = app.env,
      docuDic = env.DOCUMENT,
      appDic  = env.APP,
      index   = 0,
      dic;

  from = path.resolve(from);

  if (from == docuDic || appDic == from) {
    return result;
  }

  while (from.length) {
    index = from.lastIndexOf('/');

    if (index === -1) {
      break;
    }

    dic   = from.slice(index + 1);

    if (!(dic == 'node_modules')) {
      result.push(from + '/node_modules');
    }

    from = from.slice(0, index);

    if (from == docuDic || from == appDic) {
      break;
    }
  }

  return result;
}


// 'index.' character codes
var indexChars = [ 105, 110, 100, 101, 120, 46 ];
var indexLen = indexChars.length;
Module._resolveLookupPaths = function(request, parent) {
  var length = request.length;

  if (NativeModule.existsModule(request)) {
    return [request, []];
  }

  if (length < 2 ||
      request.charCodeAt(0) !== 46/*.*/ ||
      (request.charCodeAt(1) !== 46/*.*/ &&
       request.charCodeAt(1) !== 47/*/*/)) {
    var paths = modulePaths;
    if (parent) {
      if (!parent.paths)
        paths = parent.paths = [];
      else
        paths = parent.paths.concat(paths);
    }

    // Maintain backwards compat with certain broken uses of require('.')
    // by putting the module's directory in front of the lookup paths.
    if (request === '.') {
      if (parent && parent.filename) {
        paths.unshift(path.dirname(parent.filename));
      } else {
        paths.unshift(path.resolve(request));
      }
    }

    return [request, paths];
  }

  // with --eval, parent.id is not set and parent.filename is null
  if (!parent || !parent.id || !parent.filename) {
    // make require('./path/to/foo') work - normally the path is taken
    // from realpath(__filename) but with eval there is no filename
    var mainPaths = ['.'].concat(Module._nodeModulePaths('.'), modulePaths);
    return [request, mainPaths];
  }

  // Is the parent an index module?
  // We can assume the parent has a valid extension,
  // as it already has been accepted as a module.
  const base = path.basename(parent.filename);
  var parentIdPath;
  if (base.length > indexLen) {
    var i = 0;
    for (; i < indexLen; ++i) {
      if (indexChars[i] !== base.charCodeAt(i))
        break;
    }
    if (i === indexLen) {
      // We matched 'index.', let's validate the rest
      for (; i < base.length; ++i) {
        const code = base.charCodeAt(i);
        if (code !== 95/*_*/ &&
            (code < 48/*0*/ || code > 57/*9*/) &&
            (code < 65/*A*/ || code > 90/*Z*/) &&
            (code < 97/*a*/ || code > 122/*z*/))
          break;
      }
      if (i === base.length) {
        // Is an index module
        parentIdPath = parent.id;
      } else {
        // Not an index module
        parentIdPath = path.dirname(parent.id);
      }
    } else {
      // Not an index module
      parentIdPath = path.dirname(parent.id);
    }
  } else {
    // Not an index module
    parentIdPath = path.dirname(parent.id);
  }
  var id = path.resolve(parentIdPath, request);

  // make sure require('./path') and require('path') get distinct ids, even
  // when called from the toplevel js file
  if (parentIdPath === '.' && id.indexOf('/') === -1) {
    id = './' + id;
  }

  return [id, [path.dirname(parent.filename)]];
};

Module._load = function(request, parent, isMain) {
  var filename      = Module._resolveFilename(request, parent, isMain),
      cachedModule  = Module._cache[filename],
      module;

  if (cachedModule) {
    return cachedModule.exports;
  }

  if (NativeModule.existsModule(filename)) {
    return NativeModule.require(filename);
  }

  module = new Module(filename, parent);

  Module._cache[filename] = module;
  Module._tryModuleLoad(module, filename);

  return module.exports;
};

Module._tryModuleLoad = function (module, filename) {
  try {
    module.load(filename);
  } catch (e) {
    delete Module._cache[filename];
  }
}

Module._resolveFilename = function(request, parent, isMain) {
  var resolvedModule,
      filename,
      id,
      paths,
      error;

  if (NativeModule.existsModule(request)) {
    return request;
  }

  resolvedModule = Module._resolveLookupPaths(request, parent);

  id    = resolvedModule[0];
  paths = resolvedModule[1];

  filename = Module._findPath(request, paths, isMain);

  if (filename) {
    return filename;
  }

  error       = new Error('Cannot find module ' + request);
  error.code  = 'MODULE_NOT_FOUND';

  throw error;
};


// Given a file name, pass it to the proper extension handler.
Module.prototype.load = function(filename) {
  var extension

  this.filename = filename;
  this.paths    = Module._nodeModulePaths(path.dirname(filename));
  extension     = path.extname(filename) || '.js';

  if (!Module._extensions[extension]) {
    extension = '.js';
  }

  Module._extensions[extension](this, filename);

  this.loaded = true;
};

Module.prototype.require = function(path) {
  if (path == 'app') {
    return app;
  }

  return Module._load(path, this, false);
};

Module.prototype._compile = function(content, filename) {
  var length = content.length,
      dirname,
      require,
      args,
      depth,
      result,
      wrapper,
      compiledWrapper,
      code;

  if (length >= 2) {
    if (content.indexOf('#!') == 0) {
      if (length == 2) {
        content = '';
      } else {
        for (var i = 2;i < length; i++) {
          code = content.charCodeAt(i);

          if (code === 10 || code === 13) {
            break;
          }
        }

        if (i == length) {
          content = '';
        } else {
          content = content.slice(i)
        }
      }
    }
  }

  wrapper         = NativeModule.context(content);
  compiledWrapper = app.runThis(wrapper)
  dirname         = path.dirname(filename);
  require         = internalModule.makeRequireFunction.call(this);
  args            = [this.exports, require, this, filename, dirname];
  depth           = internalModule.requireDepth;
  result          = compiledWrapper.apply(this.exports, args);

  return result;
};


// Native extension for .js
Module._extensions['.js'] = function(module, filename) {
  var content = fileManager.readFileSync(filename, 'utf8');

  module._compile(internalModule.stripBOM(content), filename);
};


// Native extension for .json
Module._extensions['.json'] = function(module, filename) {
  var content = fileManager.readFileSync(filename, 'utf8');

  try {
    module.exports = JSON.parse(internalModule.stripBOM(content));
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};

Module._initPaths = function() {
  modulePaths = [app.env.APP];

  Module.globalPaths = modulePaths.slice(0);
};

Module._initPaths();

// backwards compatibility
Module.Module = Module;

module.exports = Module;
