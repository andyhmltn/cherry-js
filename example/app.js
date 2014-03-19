 $(function() {

  var counter = new Cherry()

  var counterController = counter.controller('counterController', function($scope) {

    $scope.i = 1;
    $scope.amount = 1;

    $scope.add = function() {
      $scope.i = parseInt($scope.i) + parseInt($scope.amount)
    }

    $scope.take = function() {
      $scope.i = parseInt($scope.i) - parseInt($scope.amount)
    }

    $scope.pluralise = function(key,singular,plural) {
      if($scope[key] == 1)
        return singular
      else
        return plural
    }

    $scope.subtractForDisplay = function(key, amount) {
      return $scope[key] - parseInt(amount)
    }

  });
});