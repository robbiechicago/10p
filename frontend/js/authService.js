angular.module('tPsWeb')
  .factory('authService', authService);

function authService($http, $q){
  var user = null;

  return {
    isLoggedIn: function() {
      
      if(user) {
        return true;
      } else {
        return false;
      }
    },
    getUserStatus: function() {
      return user;
    }
  }
}