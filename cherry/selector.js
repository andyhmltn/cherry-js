// Find a better name for this file please
var CherrySelector = function(argument) {
  return new CherrySelectorResult(document.querySelectorAll(argument))
}

var CherrySelectorResult = function(array) {
  var $$ = this

  $$.list = array
}

CherrySelectorResult.prototype.addClass = function(className) {

  for(var key in $$.list) {
    $$.list[key].className += ' '+className
    console.log($$.list[key].className)
  }

}

var c = CherrySelector