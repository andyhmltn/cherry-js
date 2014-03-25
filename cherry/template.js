
var CherryTemplate = function(scope) {
  var $$ = this

  // Assign the template it's
  // parent scope
  $$.scope = scope

  // Find the parent div
  // for the parent scope
  $$.parentSelector = '[data-cherry="'+scope.controller.name+'"]'
  $$.parent = c($$.parentSelector)
  // This class isn't used yet but will
  // be in future... soon(tm)

  $$.parent.addClass('cherry-watch')

  $$.tokenizer = new Tokenizer($$.parent)

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
    $$.tokenizer.run()

    $$.repeatTags()
    $$.showTags()
    // $$.repeatTags()
    // Replace data-var and data-model
    // tags
    $$.modelTags(key,value)
    // data-eval function tags
    $$.evalTags()
  }

  $$.repeatTags = function() {
    var $$ = this;
    c('[data-repeat]').each(function($key, $me) {

      // Remove the repeaters
      // that were inserted previously
      // so they don't repeat constantly
      var repeaters = $me.parentNode.querySelectorAll('[data-repeater]')

      for(var x=0; x<repeaters.length; x++) {
        var $node = repeaters[x]

        $node.parentNode.removeChild($node)
      }

      var attribute = $me.getAttribute('data-repeat').split(' in '),
          scopeVar  = $$.scope[attribute[1]]

      for(key in scopeVar) {
        var $clone = $me.cloneNode(true)

        $clone.style.display = ''
        $clone.removeAttribute('data-repeat')
        $clone.setAttribute('data-repeater',key)

        $me.parentNode.appendChild($clone)
        $$.repeatTagChildren($clone)
      }
      $me.style.display = 'none'
    })
  }

  $$.repeatTagChildren = function(node) {
    var children = node.querySelectorAll('[data-repeat-child]')

    for(var x=0; x<children.length; x++) {

      var $child   = children[x],
          scopeSelector = $child.getAttribute('data-repeat-child'),
          key      = $child.parentNode.getAttribute('data-repeater')
          scopeVar = $$.scope[scopeSelector][parseInt( key )]

      var $newNode = document.createTextNode(scopeVar)

      $child.parentNode.appendChild($newNode)
      $child.parentNode.removeChild($child) 
    }
  }

  $$.showTags = function() {
    c('[data-show]').each(function(key, value) {
      var attribute = value.getAttribute('data-show'),
          scopeVar  = $$.scope[attribute],
          result

      if(typeof scopeVar == 'function')
        result = scopeVar.apply(null,[])
      else
        result = scopeVar

      if(result === true)
        value.style.display = ''
      else
        value.style.display = 'none'
    })
  }

  // This is quite long and needs
  // refactoring but hey!
  // This is the function for repeating
  // tags

  // This finds data-var and
  // data-model tags and replaces
  // their contents
  $$.modelTags = function(key,value) {
    var holder = c('[data-var="'+key+'"], [data-model="'+key+'"]')

    holder.each(function(key, tag) {
      if(tag.tagName == 'SELECT' || tag.tagName == 'INPUT') {
        tag.value = value
      } else {
        tag.innerHTML = value
      }
    })
  }

  // For all data-eval tags. It
  // calls the function with the arguments
  // specified
  $$.evalTags = function() {
    c('[data-eval]').each(function(key, value) {
      var _tag = value,
          _call = _tag.getAttribute('data-eval').split(' '),
          _function_name = _call.shift(),
          _arguments     = _call

      _tag.innerHTML = $$.scope.call(_function_name, _arguments)
    })
  }

  $$.updateModel = function(target) {
    var scope_key  = this.getAttribute('data-model')

    $$.scope[scope_key] = this.value
    $$.scope.$digest()
  }

  
  // data-click event method
  document.addEventListener('click', function(event) {
    if(event.target.hasAttribute('data-click')) {
      var _event = event.target.getAttribute('data-click')

      $$.scope.call(_event);
    }
  })

  // Model update events
  document.addEventListener('keyup', function(event) {
    if(event.target.hasAttribute('data-model')) {
      $$.updateModel.call(event.target, event);
    }
  })

  document.addEventListener('change', function(event) {
    if(event.target.hasAttribute('data-model')) {
      $$.updateModel.call(event.target, event);
    }

  })
}