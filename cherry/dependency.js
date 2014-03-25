// Dependency injection
// Fancy!

var CherryDependency = function() {
  var $$ = this

  $$.FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
  $$.default_dependencies = []
}

CherryDependency.prototype.registerDefaults = function(object) {
  var $$ = this

  for(key in object) {
    $$.default_dependencies[key] = object[key]
  }
}

CherryDependency.prototype.getDependencies = function(arr) {
  var $$ = this

  return arr.map(function(dependencyName) {
    return $$.default_dependencies[dependencyName]
  })
}
CherryDependency.prototype.inject = function(callback,defaults) {
  var $$ = this

  var args = callback.toString()
                     .match(this.FN_ARGS)[1]
                     .split(', ').join(',')
                     .split(',')

  $$.registerDefaults(defaults)

  callback.apply(callback, $$.getDependencies(args))
}