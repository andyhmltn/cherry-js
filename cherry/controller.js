var Controller = function(name) {
  var $$ = this

  $$.name = name
  $$.scope = null
}

Controller.prototype.addScope = function(scope) {
  this.scope = scope
}