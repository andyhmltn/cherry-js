var CherryScope = function(app, controller) {
  var _scope = this;

  _scope.data = {}
  _scope.controller = controller
  _scope.app = app

  _scope.set = function(key, value) {
    _scope.data[key] = value
    return _scope.template.notify(key);
  }

  _scope.get = function(key) {
    return _scope.data[key]
  }

  _scope.call = function(function_name) {
    _scope.data[function_name]()
  }

  _scope.formatters = {}
  _scope.formatter = function(name, callback) {
    _scope.formatters[name] = callback
    _scope.template.updateFormatters()
  }

  _scope.template = new CherryTemplate(this)
}
