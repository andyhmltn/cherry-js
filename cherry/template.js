
var CherryTemplate = function(scope) {

  var _template = this


  _template.getSection = function(key) {
    return _template.parent.find('[data-'+key+']');
  }

  _template.scope = scope

  _template.parent = $('[data-cherry="'+scope.controller+'"]');
  _template.parent.addClass('cherry-watch');

  _template.formatForHTML = function(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

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
    var value = _template.formatForHTML(_template.scope.get(key));
    var holder = $('[data-var="'+key+'"], [data-model="'+key+'"]');

    _template.updateFormatters();

    holder.html(value).val(value);
  }


  _template.getSection('click').each(function(key,value) {
    var _event = $(value).attr('data-click')

    $(value).on('click', function() {
      _template.scope.call(_event);
    });
  });

  _template.getSection('model').each(function(key, input) {
    var scope_key     = $(input).attr('data-model'),
        default_value = _template.scope.get(scope_key);

    $(input).val(default_value)

    $(input).on('keyup', function() {
      _template.scope.set(scope_key, $(this).val())
    })
  });

}