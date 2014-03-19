var scope;
 $(function() {

  var counter = new Cherry()

  var counterController = counter.controller('counterController', function($scope) {
    scope = $scope;

    $scope.i = 1;
    $scope.amount = 1;

    $scope.add = function() {
      $scope.i = parseInt($scope.i) + parseInt($scope.amount)
    }

    $scope.take = function() {
      $scope.i = parseInt($scope.i) - parseInt($scope.amount)
      console.log($scope.i)
    }

  });
});