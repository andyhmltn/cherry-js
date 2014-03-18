 $(function() {

  var counter = new Cherry()

  var counterController = counter.controller('counterController', function(scope) {
    scope.set('i', 1);

    scope.set('add', function() {
      scope.set('i', parseInt(scope.get('i')) + 1)
    })

    scope.set('take', function() {
      scope.set('i', parseInt(scope.get('i')) - 1)
    })

    scope.formatter('pluralise', function(value, format) {
      var formats = format.split(' / ');

      if(value == 1)
        return formats[0]
      else
        return formats[1]
    });
  });
});