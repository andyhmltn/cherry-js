var Cherry = function() {
  var $$ = this;

  $$.controllers = []
  $$.dependencyInjector = new CherryDependency()
}

Cherry.prototype.controller = function(name, callback) {
  var $$ = this;

  var controller = new Controller(name),
      scope      = new Scope($$, controller)

  controller.addScope(scope)
  $$.controllers.push(controller)


  $$.dependencyInjector.inject(callback, {'$scope':scope})
  scope.$digest()
}