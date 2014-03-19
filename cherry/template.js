
var CherryTemplate = function(scope) {
  var $$ = this

  // Short hand for finding
  // data-* tags in the parent
  $$.getSection = function(key) {
    return $$.parent.find('[data-'+key+']');
  }

  // Assign the template it's
  // parent scope
  $$.scope = scope

  // Find the parent div
  // for the parent scope
  $$.parent = $('[data-cherry="'+scope.controller+'"]');
  // This class isn't used yet but will
  // be in future... soon(tm)
  $$.parent.addClass('cherry-watch');

  // Stop malicious <script>alert('hey')</script>
  // outputs
  $$.formatForHTML = function(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // When a variable in the scope is changed, this
  // notify function is called and it will act
  // on the changes accordingly
  $$.notify = function(key) {
    // Pull the new value from the
    // scope
    var value = $$.formatForHTML($$.scope[key]).toString();

    // Replace the tags with
    // their tag variant
    $$.replaceTokens()

    // Replace data-var and data-model
    // tags
    $$.modelTags(key,value)
    // data-eval function tags
    $$.evalTags()
  }

  // This finds data-var and
  // data-model tags and replaces
  // their contents
  $$.modelTags = function(key,value) {
    var holder = $('[data-var="'+key+'"], [data-model="'+key+'"]');

    holder.html(value).val(value);
  }

  // For all data-eval tags. It
  // calls the function with the arguments
  // specified
  $$.evalTags = function() {
    $$.getSection('eval').each(function(key,value) {
      var _tag  = $(value),
          _call = _tag.attr('data-eval').split(' '),
          _function_name = _call.shift(),
          _arguments     = _call

      _tag.html($$.scope.call(_function_name, _arguments))
    });
  }

  // The format for finding tokens
  $$.tokenFormat    = /\{\{([a-z ]*)\}\}/g

  // Converts raw tokens {{example}} to
  // an easier variant: example
  $$.formatRawToken = function(string) {
    return string.replace('{{','').replace('}}','')
  }

  // Find the tokens in the parents
  // html markup
  $$.findTokens  = function() {
    return $$.parent.html().match($$.tokenFormat)
  }

  // Find and replace the tokens
  // with what they are needed
  // to be
  $$.replaceTokens = function() {
    var raw_tokens = $$.findTokens();

    if(raw_tokens == null) return;

    for(var i=0; i<raw_tokens.length; i++) {

      var token  = raw_tokens[i],
          token_formatted = $$.formatRawToken(token)

      // If the token has arguments ({{example hello world}})
      // then replace it as an eval tag
      if(token_formatted.split(' ').length > 1) {
        var raw = token_formatted.split(' '),
            to_call = raw.shift()
            arguments = raw
        
        var rendered = $$.parent.html().replace(token, '<span data-eval="'+token_formatted+'"></span>');
      } else {
      // Else it's a data-var tag
        result = $$.scope[token_formatted]

        if(typeof result !== 'undefined') {
          var rendered = $$.parent.html().replace(token, '<span class="cherry-var" data-var="'+token_formatted+'"></span>');

        }
      }

      // Updated with the rendered
      // HTML
      $$.parent.html(rendered);
    }
  }

  // Bindings for data-click
  // events
  $(document).on('click', '[data-click]', function() {
    var _event = $(this).attr('data-click')
    $$.scope.call(_event);
  })

  // Bindings for data-model
  // inputs
  $(document).on('keyup', '[data-model]', function() {
    var scope_key  = $(this).attr('data-model')

    $$.scope[scope_key] = $(this).val()
    $$.scope.$digest()
  })
}