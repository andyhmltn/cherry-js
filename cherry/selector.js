// Find a better name for this file please
var CherrySelector = function(argument, use_list) {
  var $$ = this

  var _use_list = use_list || false

  if(! use_list) {
    $$.list = []
    if(typeof argument != 'undefined') this.find(argument)
  } else {
    $$.list = argument
  }
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

CherrySelector.prototype.findChild = function(search) {
  for(key in this.list) {

    var result = this.list[key].querySelectorAll(search)

    return new CherrySelector(result, true)

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