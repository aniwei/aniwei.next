(function(entry, app){
  'use strict';

  ;(function(getNativeModule){
    var NativeModule = getNativeModule();

    NativeModule.require('internal/module');
    NativeModule.runMain();

  })(function(){
    var moduleCache   = {
          app: app
        },
        moduleSource  = app.modules || {},
        nativeModule  = {};

    function Module (id) {
      this.filename = `${id}.js`;
      this.id       = id;
      this.exports  = {};
      this.loaded   = false;
      this.loading  = false;
    }

    Module.prototype.compile = function() {
      var source = nativeModule.getModuleSource(this.id);

      source = nativeModule.context(source);

      this.loading = true;

      try {
        const moduleFactory = app.runThis(source);
        moduleFactory(this.exports, nativeModule.require, this, this.filename);

        this.loaded = true;
      } finally {
        this.loading = false;
      }
    };

    Module.prototype.cache = function() {
      moduleCache[this.id] = this;
    };

    nativeModule.require = function (id) {
      if (id == 'native_module') {
        return nativeModule;
      }

      if (id == 'app') {
        return app;
      }

      const cached = nativeModule.getModuleCache(id);

      if (cached) {
        if (cached.loaded || cached.loading) {
          return cached.exports;
        }
      }

      if (!nativeModule.existsModule(id)) {
        throw new Error(`No such native module ${id}`);
      }

      const module = new Module(id);

      module.cache();
      module.compile();

      return module.exports;
    }

    nativeModule.getModuleCache = function (id) {
      return moduleCache[id];
    }

    nativeModule.existsModule = function (id) {
      return moduleSource[id];
    }

    nativeModule.getModuleSource = function (id) {
      return moduleSource[id];
    }


    nativeModule.context = function (script) {
      return `(function (exports, require, module, __filename, __dirname) {\n${script}});`
    }

    nativeModule.runMain = function () {
      nativeModule.require('app');
      nativeModule.require('module')._load(entry);
    }

    return nativeModule;
  });
})
