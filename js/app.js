var app = new Cherry();

var example2 = app.controller('example2', function($scope) {
  $scope.place = 'world'
})

var example3 = app.controller('example3', function($scope) {
  $scope.show_message = false;
  $scope.toggleMessage = function() {
    console.log($scope.show_message)
    if($scope.show_message)
      $scope.show_message = false
    else
      $scope.show_message = true
  }
})

var example4 = app.controller('example4', function($scope) {
  $scope.todos = ['Check out Cherry.JS', 'Make awesome stuff']

  $scope.add_todo = function() {
    $scope.todos.push($scope.new_todo)

    $scope.new_todo = ''
  }
})