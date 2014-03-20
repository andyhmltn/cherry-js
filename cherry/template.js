
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
  $$.parent = $('[data-cherry="'+scope.controller.name+'"]');
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

    $$.repeatTags()
    // Replace data-var and data-model
    // tags
    $$.modelTags(key,value)
    // data-eval function tags
    $$.evalTags()
  }

  // This is quite long and needs
  // refactoring but hey!
  // This is the function for repeating
  // tags
  $$.repeatTags = function() {
    $$.getSection('repeat').each(function(key, value) {
      console.log('test');
      var $me = $(value),
          attribute = $me.attr('data-repeat'),
          // The arguments should be formatted
          // as x in y
          // so this splits that
          args = attribute.split(' in '),
          key = args[0].split(':'),
          list = $$.scope[args[args.length-1]],
          tokens = $$.findTokens($me)

      // Time to replace
      // all the child tokens in
      // the repeating tag!
      for(token_key in tokens) {
        var token = tokens[token_key],
            token_split = $$.formatRawToken(token).split('.')

        // If it looks like this: item.value
        if(token_split.length > 1) {
          if(key == token_split[0]) {
            var rendered = $me.html().replace(token, "<span data-repeat-child='"+token_split[token_split.length-1]+"'></span>")

            $me.html(rendered)
          }
        }
      }

      // Don't want to keep data-repeat
      // on the generated items
      $me.removeAttr('data-repeat')

      var length = list.length
      while(length--) {
        // Clone the item
        // on each iteration
        var $clone = $me.clone(),
            tokens = $clone.find('[data-repeat-child]'),
            current = list[length];

        // Replace the tokens with what they
        // need to be
        tokens.each(function(key, value) {
          var label = $(value).attr('data-repeat-child');

          // If it's just an array use item.value
          // to pull in the value
          if(typeof current.length == 'number')
            var the_value = current
          else
            var the_value = current[label]

          $(value).replaceWith(the_value);
        })

        // Set up the data-value
        // attribute to take from
        // the new item
        if($clone.attr('data-value')) {
          if(typeof current.length == 'number') {
            $clone.val(current)
          } else {
            $clone.val(current[$clone.attr('data-value')]);
          }

          $clone.removeAttr('data-value')
        }

        $me.parent().append($clone);
      }

      // Remove the original spawn
      $me.remove()
    })
  }
  // This finds data-var and
  // data-model tags and replaces
  // their contents
  $$.modelTags = function(key,value) {
    var holder = $('[data-var="'+key+'"], [data-model="'+key+'"]'),
        length = holder.length
    while(length--) {
      var $me = $(holder[length]);


      if($me.prop('tagName') == 'SELECT' || $me.prop('tagName') == 'INPUT') {
        $me.val(value);
      } else {
        $me.html(value);
      }
    }
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
  $$.tokenFormat    = /\{\{([a-z 0-9A-Z.]*)\}\}/g

  // Converts raw tokens {{example}} to
  // an easier variant: example
  $$.formatRawToken = function(string) {
    return string.replace('{{','').replace('}}','')
  }

  // Find the tokens in the parents
  // html markup
  $$.findTokens  = function(parent) {
    if(typeof parent == 'undefined') var parent = $$.parent
    return parent.html().match($$.tokenFormat)
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

  $$.updateModel = function(tag) {
    var scope_key  = $(this).attr('data-model')

    $$.scope[scope_key] = $(this).val()
    $$.scope.$digest()
  }

  $(document).on('keyup', '[data-model]', $$.updateModel)
  $(document).on('change', '[data-model]', $$.updateModel)
}