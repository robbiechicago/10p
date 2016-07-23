angular.module('tPsWeb')
  .service('gamesService', gamesService);

function gamesService($http){
  return {
    getAllGames: function() {
      console.log('getAllGames is running')
      var req = {
        method:'GET',
        url:'http://localhost:3000/games/',
        headers: {'Content-Type': 'application/json'}
      };

      return $http(req).success(function(res){
        // success
      }).error(function(data, status, headers, config){
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
      });
    }
  }
};
