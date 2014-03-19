
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
    var value = _template.formatForHTML(_template.scope[key]).toString();

    var holder = $('[data-var="'+key+'"], [data-model="'+key+'"]');

    _template.replaceTokens()
    _template.updateFormatters();
    holder.html(value).val(value);
  }

  // Token functions
  // TODO: Comment
  _template.tokenFormat    = /\{\{(.*)\}\}/g
  _template.formatRawToken = function(string) {
    return string.replace('{{','').replace('}}','')
  }
  _template.findTokens  = function() {
    return _template.parent.html().match(_template.tokenFormat)
  }
  _template.replaceTokens = function() {
    var raw_tokens = _template.findTokens();

    if(raw_tokens == null) return;

    for(var i=0; i<raw_tokens.length; i++) {

      var token  = raw_tokens[i],
          token_formatted = _template.formatRawToken(token)
          result = _template.scope[token_formatted]

      if(typeof result !== 'undefined') {
        var rendered = _template.parent.html().replace(token, '<span class="cherry-var" data-var="'+token_formatted+'"></span>');

        _template.parent.html(rendered)
      }

    }
  }

  $(document).on('click', '[data-click]', function() {
    var _event = $(this).attr('data-click')
    _template.scope.call(_event);
  })


  $(document).on('keyup', '[data-model]', function() {
    var scope_key  = $(this).attr('data-model')

    _template.scope[scope_key] = $(this).val()
    _template.scope.$digest()
  })
}