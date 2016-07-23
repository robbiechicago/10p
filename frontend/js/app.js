angular
  .module('tPsWeb', ['ui.router'])
  .config(mainRouter)
  .run(appRun)

function mainRouter($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html',
      controller: 'homeCtrl as hc'
    })
    .state('test', {
      url: '/test',
      templateUrl: 'test.html',
      controller: 'testCtrl as tc'
    })
}

function appRun($rootScope, gamesService, commonFunctions) {
  console.log('Hello.  Welcome to tPs!');
  // $rootScope.logged_in = 
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    console.log('route change stuff...')
    if (next.access.restricted && AuthService.isLoggedIn() === false) {
      $location.path('/login');
    }
  });
}
