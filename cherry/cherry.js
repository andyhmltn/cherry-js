var Cherry = function() {


  var _cherry = this;
  var controllers = []

  _cherry.controller = function(name, callback) {
    controllers.push(name);
    var scope = new CherryScope(_cherry, name);

    callback(scope);
  }
}