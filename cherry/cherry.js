var Cherry = function() {
  var $$ = this;

  $$.controllers = []
}

Cherry.prototype.controller = function(name, callback) {
  var $$ = this;

  var controller = new Controller(name),
      scope      = new Scope($$, controller) 

  controller.addScope(scope)
  callback(scope)

  scope.$digest()
}