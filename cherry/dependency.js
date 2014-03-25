var CherryDependency = function() {
  var $$ = this

  $$.FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
}

CherryDependency.prototype.getDependencies = function(arr, dependencies) {
  var $$ = this

  return arr.map(function(dependencyName) {
    return dependencies[dependencyName]
  })
}

CherryDependency.prototype.inject = function(callback,dependencies) {
  var $$ = this

  var args = callback.toString()
                     .match(this.FN_ARGS)[1]
                     .split(', ').join(',')
                     .split(',')

  callback.apply(callback, $$.getDependencies(args, dependencies))
}