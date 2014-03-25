var Cherry = function() {
  var $$ = this;

  $$.controllers = []
  $$.dependencyInjector = new CherryDependency()
  $$.dependencies = {}
}

Cherry.prototype.registerDependency = function(key, callback) {
  this.dependencies[key] = callback
}

Cherry.prototype.controller = function(name, callback) {
  var $$ = this;

  var controller = new Controller(name),
      scope      = new Scope($$, controller)

  controller.addScope(scope)
  $$.controllers.push(controller)

  // Dependency injection
  var dependencies = $$.dependencies

  dependencies['$scope'] = scope
  $$.dependencyInjector.inject(callback, dependencies)
  scope.$digest()
}