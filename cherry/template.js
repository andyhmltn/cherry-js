
var CherryTemplate = function(scope) {

  var _template = this


  _template.getSection = function(key) {
    return _template.parent.find('[data-'+key+']');
  }

  _template.scope = scope

  _template.parent = $('[data-cherry="'+scope.controller+'"]');
  _template.parent.addClass('cherry-watch');


  _template.updateFormatters = function() {
    $(_template.getSection('formatter')).each(function(key, section) {
      var label = $(section).attr('data-formatter').split(':');

      var _name     = label[0];
      var parameter = label[1];

      var formatter = scope.formatters[_name];

      if(typeof formatter != 'undefined') {
        var val = scope.get(parameter);
        var format = $(section).attr('data-format');

        returned_value = formatter(val,format);

        $(section).html(returned_value);
      }
    });
  }

  _template.notify = function(key) {
    var value = _template.scope.get(key);
    var holder = $('[data-var="'+key+'"]');

    _template.updateFormatters();

    holder.html(value);
  }

  _template.parent.find('[data-click]').each(function(key,value) {
    var _event = $(value).attr('data-click')

    $(value).on('click', function() {
      _template.scope.call(_event);
    });
  });

}