var Scope = function(app,controller) {

  // This whole $$ approach is used
  // through this file. It's to solve
  // scoping issues with this
  var $$ = this;

  // The actual watcher objects
  $$.watchers = [];
  // The keys that are being watched
  $$.watching = [];

  // The parent application
  $$.app        = app;
  // The name of the controller
  $$.controller = controller;

  // The names of keys that are associated
  // with the scope object
  $$.scopeKeys  = Object.keys($$);
  // The above doesn't include
  // the one we've just defined :)
  $$.scopeKeys.push('scopeKeys');

  // Create a template for this scope
  $$.template = new CherryTemplate($$);
}

// The watch function adds
// a watcher to the list
// and is then run by the $digest
// function.
Scope.prototype.$watch = function(key,watchFunction, listenerFunction) {
  var watcher = {
    key: key,
    watchFunction: watchFunction,
    listenerFunction: listenerFunction
  }

  this.watching.unshift(key)
  this.watchers.unshift(watcher)
}

// This allows the key to be used
// dynamically in the $watch method
// TODO: Needs a better name
Scope.prototype.$createWatcher = function(key) {
  return function(scope) { return scope[key] }
}

// This runs over each of the keys of this
// scope and if it's one that's not being watched,
// it adds it creates a new watcher for it
Scope.prototype.$init = function() {
  $$ = this;
  var keys = Object.keys($$);

  for(var i=0; i<keys.length; i++) {
    var key = keys[i];

    if($$.scopeKeys.indexOf(key) == -1 && $$.watching.indexOf(key) == -1) {
      $$.$watch(
        key,
        $$.$createWatcher(key),
        function(key, newValue, oldValue, scope) {
          if(newValue) {
            $$.template.notify(key);
          }
        }
      )
    }
  }

  return true;
}

// This calls the $init function above first
// then cycles through the watchers
// gets their values and if
// it's changed from what they were before
// it runs the listener
Scope.prototype.$digest = function() {
  if(this.$init()) {
    var length = $$.watchers.length;
    var watcher, newValue, oldValue

    while(length--) {
        watcher = $$.watchers[length];
        newValue = watcher.watchFunction($$);
        oldValue = watcher.last;

        if(newValue !== oldValue) {
          watcher.last = newValue;
          watcher.listenerFunction(watcher.key, newValue, oldValue, $$);
        }
    }
  }
}

// Short hand for calling a scope function
// then running the $digest
Scope.prototype.call = function(key,arguments) {
  // var arguments = Array.prototype.slice.call(arguments)
  var result = $$[key].apply(null, arguments)
  $$.$digest();

  return result
}