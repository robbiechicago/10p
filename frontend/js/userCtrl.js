angular.module('tPsWeb')
  .controller('userCtrl', userCtrl);

userCtrl.$inject = ['$rootScope', '$scope', 'commonFunctions'];

function userCtrl($rootScope, $scope, commonFunctions) {
  console.log('hello! userCtrl')
  var self = this;

  self.register_user = register_user;
  function register_user(user) {
    var obj = {
      'local.username': user.name,
      'local.password': user.password
    }
    commonFunctions.api_call('post', 'users', obj).then(function(res) {
      console.log(res);
    })
  }

  self.login_user = login_user;
  function login_user(user) {
    var obj = {
      'local.username': user.name,
      'local.password': user.password
    }
    commonFunctions.api_call('post', 'login', obj).then(function(res) {
      console.log('result of login attempt:')
      console.log(res);
      $rootScope.logged_in = res.logged_in ? true : false;
      $rootScope.user = res.logged_in ? res.user._id : false;
      console.log('$rootScope.user')
      console.log($rootScope.user)
      console.log($scope.user)
    })
  }

  self.getUserStatus = getUserStatus;
  function getUserStatus() {
    commonFunctions.api_call('get', 'user/status', '').then(function(res){
      console.log(res)
    })
  }


}