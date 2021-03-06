var Tokenizer = function(el) {
  var $$ = this

  $$.el = el.list[0]

  $$.tokenFormat = /\{\{([a-z 0-9A-Z.]*)\}\}/g

  $$.formats = {
    'eval':'<span class="cherry-eval" data-eval="?"></span>',
    'var' :'<span class="cherry-var" data-var="?"></span>',
    'repeat':'<span class="cherry-repeat-child" data-repeat-child="?" data-key="@"></span>'
  }
}

Tokenizer.prototype.formatRawToken = function(string) {
  return string.replace('{{','').replace('}}','')
}
Tokenizer.prototype.findTokens = function(parent) {
  if(typeof parent == 'undefined')
    var el = this.el
  else
    var el = parent

  if(typeof el != 'undefined')
    return el.innerHTML.match(this.tokenFormat)
  else
    return false
}
Tokenizer.prototype.run = function() {
  var $$ = this
  
  $$.renderRepeatTags()

  var raw_tokens = $$.findTokens()

  if(raw_tokens == null) return

  for(key in raw_tokens) {

    var token = raw_tokens[key],
        token_formatted = $$.formatRawToken(token),
        rendered


    if(token_formatted.split(' ').length > 1)
      rendered = $$.renderEvalTag(token,token_formatted)
    else
      rendered = $$.renderVarTag(token,token_formatted)

    $$.el.innerHTML = rendered
  }
}

Tokenizer.prototype.renderRepeatTags = function() {
  var $$ = this

  c('[data-repeat]').each(function($key, $me) {

    var tokens = $$.findTokens($me),
        attribute = $me.getAttribute('data-repeat').split(' in '),
        scopeVar  = attribute[1]


    for(key in tokens) {
      var token = tokens[key],
          token_formatted = $$.formatRawToken(token),
          rendered

      rendered = $me.innerHTML.replace(token, $$.formats['repeat'].replace('?', scopeVar).replace('@', token_formatted))

      $me.innerHTML = rendered
    }
  })
}

Tokenizer.prototype.renderVarTag = function(token,token_formatted) {
  var $$ = this

  return $$.el.innerHTML.replace(token, $$.formats['var'].replace('?', token_formatted))
}

Tokenizer.prototype.renderEvalTag = function(token,token_formatted) {
  var $$   = this,
      raw  = token_formatted.split(' '),
      args = raw,
      to_call = raw.shift

  return $$.el.innerHTML.replace(token, $$.formats['eval'].replace('?', token_formatted))
}