// Find a better name for this file please
var CherrySelector = function(argument) {
  var $$ = this

  $$.list = []

  if(typeof argument != 'undefined') this.find(argument)
}

CherrySelector.prototype.find = function(argument) {
  this.list = document.querySelectorAll(argument)

  return this.list
}

CherrySelector.prototype.addClass = function(className) {
  for(key in this.list) {

    var $me = this.list[key]

    $me.className += ' '+className

  }
}

CherrySelector.prototype.html = function(argument) {
  for(key in this.list) {
    if(typeof argument != 'undefined') {
      this.list[key].innerHTML = argument
    } else {
      return this.list[key].innerHTML
    }
  }
}

CherrySelector.prototype.attr = function(attribute) {
  return this.list[0].getAttribute(attribute)
}

CherrySelector.prototype.each = function(callback) {
  for(var key=0; key<this.list.length; key++) {

    callback(key, this.list[key])

  }
}

var c = function(argument) { return new CherrySelector(argument) }