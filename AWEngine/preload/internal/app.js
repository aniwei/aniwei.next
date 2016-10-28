var  app              = require('app'),
     id               = 0;

function View (className) {
  this.className = className;
  this.viewid    = id++;
}

View.__proto__ = {
  message: function (methodName, value) {
    app.objectiveMessage(method);

    return this;
  }

  init: function () {
    return this.message('init');
  }

  alloc: function () {
    return this.message('alloc');
  }
}

app.view = function (viewName) {
  var view = new View(className);

  return view;
}


module.export = app;
