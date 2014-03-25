Cherry.js
============

What is this?
-------------

This is a small JS framework I'm coding for fun. It's definately nowhere near production ready (or good) but hopefully one day!

It works in a similar way to AngularJS at the moment with a few differences (and a LOT of exclusions.) If you want to find out how to use it, look at `example/index.html` for an idea and a demo

How to contribute
--------------

First install the dev tools:

`npm install`

then once you have finished run `gulp scripts` to compile an updated version found in `cherry.min.js`

Getting started
-------------

First, include `cherry.min.js` and then create an app:

    var app = new Cherry()

Then attach a new controller to that app:

    var controller = app.controller('myApp', function($scope) {
      $scope.greeting = 'Hello world!'
    })

Create a div with `data-cherry` set to your controller name:

    <div data-cherry="myApp">
      {{greeting}}
    </div>

should display 'Hello world!'

Click Actions
--------------

    //-- Controller
    $scope.sayHello = function(world) { alert('Hello', world)}
  
    //-- Template
    <button data-click="sayHello" data-arguments="world">Say Hello</button>

Models / Two way binding
--------------

    //-- Template
    <span>Hello {{place}}</span>
    <input data-model="place">

When the input is changed, the 'Hello {{phrase}}' template is magically updated

Lists
--------------
    
    //-- Controller
    $scope.people = ['Andy Hamilton', 'Bob']

    //-- Template
    <ul>
      <li data-repeat="person in people">{{person}}</li>
    </ul>

    //-- Controller
    $scope.posts = [{title: 'Hello world!'}]

    //-- Template
    <div data-repeat="post in posts">
      <h1>{{post.title}}</h1>
    </div>

Dependency Injection
---------------

Cherry uses dependency injection. To declare a new injector you can use:


    app.registerDependency('myDependency', function() {
      
      alert('Hello world')

    })

Then just include it in your controller parameters and use it!

    app.controller('myApp', function($scope, myDependency) {
      myDependency() #=> alert: Hello world
    })

