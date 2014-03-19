var Cherry = function() {


  var _cherry = this;
  var controllers = []

  _cherry.controller = function(name, callback) {
    controllers.push(name);
    var scope = new Scope(_cherry, name);

    callback(scope);
    scope.$digest();
  }
}