// // <div data-cherry-app="myApp">
// //   <div data-contents="i"></div>
// //   <div data-click="addOne"></div>
// // </div>

// var app = Cherry.new('myApp')

// app.controller(function(scope) {
//   scope.set('i', 1)
// })

// app.addOne = function(scope) {
//   scope.set('i', scope.get('i') + 1)
// }

var CherryScope = function(template) {
  this.data = {}
  this.template = template

  this.set = function(key, value) {
    this.data[key] = value
    return this.template.notify(key);
  }

  this.get = function(key) {
    return this.data[key]
  }
}