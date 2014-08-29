
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
  
  // data-click event method
  document.addEventListener('click', function(event) {
        if(event.target.hasAttribute('data-click')) {
      var target = event.target,
          _event = event.target.getAttribute('data-click')

      if(target.getAttribute('data-arguments') != null) {
        var arguments = target.getAttribute('data-arguments').split(',')
      } else {
        var arguments = []
      }

      $$.scope.call(_event,arguments)
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

// Stop malicious <script>alert('hey')</script>
// outputs
CherryTemplate.prototype.formatForHTML = function(string) {
  return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// When a variable in the scope is changed, this
// notify function is called and it will act
// on the changes accordingly
CherryTemplate.prototype.notify = function(key) {
  // Pull the new value from the
  // scope
  var value = this.scope[key]

  // Replace the tags with
  // their tag variant
  this.tokenizer.run()

  this.repeatTags()
  this.showTags()
  this.repeatTags()
  // Replace data-var and data-model
  // tags
  this.modelTags(key,value)
  // data-eval function tags
  this.evalTags()
}

CherryTemplate.prototype.repeatTags = function() {
  var $$ = this;
  $$.parent.findChild('[data-repeat]').each(function($key, $me) {

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

CherryTemplate.prototype.repeatTagChildren = function(node) {
  var children = node.querySelectorAll('[data-repeat-child]')

  for(var x=0; x<children.length; x++) {

    var $child   = children[x],
        scopeSelector = $child.getAttribute('data-repeat-child'),
        scopeKey = $child.getAttribute('data-key'),
        key      = $child.parentNode.getAttribute('data-repeater'),
        scopeVar = $$.scope[scopeSelector][parseInt( key )]

    if(scopeKey.split('.').length > 1) {
      scopeVar = $$.scope[scopeSelector][parseInt( key )]
      keys  = scopeKey.split('.')

      keys.shift()

      for(i in keys) {
        scopeVar = scopeVar[keys[i]]
      }
    }

    var $newNode = document.createTextNode(scopeVar)

    $child.parentNode.appendChild($newNode)
    $child.parentNode.removeChild($child) 
  }
}

CherryTemplate.prototype.showTags = function() {
  this.parent.findChild('[data-show]').each(function(key, value) {
    var attribute = value.getAttribute('data-show'),
        scopeVar  = this.scope[attribute],
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
CherryTemplate.prototype.modelTags = function(key,value) {
  var $me = this

  var holder = $me.parent.findChild('[data-var="'+key+'"], [data-model="'+key+'"]')

  holder.each(function(key, tag) {
    if(tag.tagName == 'SELECT' || tag.tagName == 'INPUT') {
      tag.value = value
    } else {
      tag.innerHTML = $me.formatForHTML(value)
    }
  })
}

// For all data-eval tags. It
// calls the function with the arguments
// specified
CherryTemplate.prototype.evalTags = function() {
  var $me = this

  $me.parent.findChild('[data-eval]').each(function(key, value) {
    var _tag = value,
        _call = _tag.getAttribute('data-eval').split(' '),
        _function_name = _call.shift(),
        _arguments     = _call

    _tag.innerHTML = $me.scope.call(_function_name, _arguments)
  })
}

CherryTemplate.prototype.updateModel = function(target) {
  var scope_key  = this.getAttribute('data-model')

  this.scope[scope_key] = this.value
  this.scope.$digest()
}
