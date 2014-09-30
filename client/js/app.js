// Heroku Muchado App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngResource'])

.run(function($window, $location, $ionicPlatform, $rootScope, AuthenticationService) {
  $rootScope.$on("$stateChangeStart", function(event, toState) {
      //redirect only if both isAuthenticated is false and no token is set
      
      if (toState.name !== 'login' && toState.name !== 'signup' &&
          toState.name !== 'logout' && toState.name !== 'register') {

        if (!AuthenticationService.isAuthenticated && !$window.localStorage.token) {

          $location.path("/register");
          event.preventDefault();
        }
      }
      
  });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    // .state('login', {
    //   url: "/login",
    //   templateUrl: "templates/login.html"
    // })


    .state('register', {
      url: "/register",
      templateUrl: "templates/register.html",
      controller: 'RegisterCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs-container.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.quiz', {
      url: '/quiz',
      views: {
        'tab-quiz': {
          templateUrl: 'templates/tab-quiz.html',
          controller: 'QuizCtrl'
        }
      }
    })

    .state('tab.leaders', {
      url: '/leaders',
      views: {
        'tab-leaders': {
          templateUrl: 'templates/tab-leaders.html',
          controller: 'LeadersCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/quiz');

  // Register middleware to ensure our auth token is passed to the server
  $httpProvider.interceptors.push('TokenInterceptor');

})

.controller('AppCtrl', function($scope, $location, RegistrationService) {
  $scope.logout = function() {
    RegistrationService.logout();
    $location.path("/register");
  }
  $scope.timeleft = '0 secs';
})

