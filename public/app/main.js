
// Declare app level module which depends on filters, and services
angular.module('katapi', ['ngRoute', 'infinite-scroll', 'katapi.api', 'katapi.welcome', 'katapi.documents', 'katapi.subjects', 'katapi.classes'])

// Setup routes
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {templateUrl: '/app/templates/welcome.html', controller: 'WelcomeController'})
    .when('/documents', {
      templateUrl: '/app/templates/documents/search.html',
      controller: 'DocumentsController'
    })
    .when('/documents/:id', {
      templateUrl: '/app/templates/documents/show.html',
      controller: 'DocumentController',
      // http://stackoverflow.com/a/19213892
      resolve: {
        // An optional map of dependencies which should be injected into the controller. 
        // If any of these dependencies are promises, the router will wait for them all
        // to be resolved or one to be rejected before the controller is instantiated.
        docs: ['$route', 'Documents', function ($route, Documents) {
          console.log('Fetch document: ' + $route.current.params.id);
          return Documents.get([{id: $route.current.params.id}]); // Returns promise
        }]
      }
    })
    .when('/documents/compare/:id1/:id2', {
      templateUrl: '/app/templates/documents/compare.html',
      controller: 'DocumentController',
      // http://stackoverflow.com/a/19213892
      resolve: {
        // An optional map of dependencies which should be injected into the controller. 
        // If any of these dependencies are promises, the router will wait for them all
        // to be resolved or one to be rejected before the controller is instantiated.
        docs: ['$route', 'Documents', function ($route, Documents) {
          console.log('Fetch documents: ' + $route.current.params.id1 + ', ' + $route.current.params.id2);
          return Documents.get([{id: $route.current.params.id1}, {id: $route.current.params.id2}]); // Returns promise
        }]
      }
    })
    .when('/subjects', {
      templateUrl: '/app/templates/subjects/search.html',
      controller: 'SubjectsController'
    })
    .when('/subjects/:id', {
      templateUrl: '/app/templates/subjects/show.html',
      controller: 'SubjectController',
      // http://stackoverflow.com/a/19213892
      resolve: {
        // An optional map of dependencies which should be injected into the controller.
        // If any of these dependencies are promises, the router will wait for them all
        // to be resolved or one to be rejected before the controller is instantiated.
        subjects: ['$route', 'Subjects', function ($route, Subjects) {
          console.log('Fetch subject: ' + $route.current.params.id);
          return Subjects.get([{id: $route.current.params.id}]);  // Returns promise
        }]
      }
    })

    .when('/classes', {
      templateUrl: '/app/templates/classes/search.html',
      controller: 'ClassesController'
    })
    .when('/classes/:id', {
      templateUrl: '/app/templates/classes/show.html',
      controller: 'ClassController',
      // http://stackoverflow.com/a/19213892
      resolve: {
        // An optional map of dependencies which should be injected into the controller.
        // If any of these dependencies are promises, the router will wait for them all
        // to be resolved or one to be rejected before the controller is instantiated.
        classes: ['$route', 'Classes', function ($route, Classes) {
          console.log('Fetch class: ' + $route.current.params.id);
          return Classes.get([{id: $route.current.params.id}]);  // Returns promise
        }]
      }
    })

    /*.when('/documents/compare/:id1/:id2', {
      templateUrl: '/app/templates/documents/compare.html',
      controller: 'DocumentsController',
      // http://stackoverflow.com/a/19213892
      resolve: {
        // An optional map of dependencies which should be injected into the controller. 
        // If any of these dependencies are promises, the router will wait for them all
        // to be resolved or one to be rejected before the controller is instantiated.
        doc: ['$route', 'Document', function ($route, Document) {
          console.log('Fetch document: ' + $route.current.params.id);
          return Document.get({ id: $route.current.params.id }).$promise;
        }],
        doc2: null
      }
    })*/

    // .when('/browse', {templateUrl: '/app/collection/collection.tpl.html', controller: 'CollectionController'})
    // .when('/browse/:page', {templateUrl: '/app/collection/collection.tpl.html', controller: 'CollectionController'})
    // .when('/cart', {templateUrl: '/app/selfservice/cart/cart.tpl.html', controller: 'CartController'})
    // .when('/checkout', {templateUrl: '/app/selfservice/checkout/checkout.tpl.html', controller: 'CheckoutController'})
    // .when('/users/:user', {templateUrl: '/app/selfservice/user/user.tpl.html', controller: 'UserController'})
    //.otherwise({redirectTo: '/'})
  ;

  $locationProvider.html5Mode(true);
}])

.controller('AppCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

  $scope.busy = true;

  $rootScope.$on('$routeChangeStart', function(event, current, next) {
    console.log('>>> routeChangeStart <<<');
    // console.log(current);
    $scope.busy = true;
  });
  $rootScope.$on('$routeChangeSuccess', function(event, current, next) {
    console.log('>>> routeChangeSuccess <<<');
    $scope.busy = false;
  });

}]);
