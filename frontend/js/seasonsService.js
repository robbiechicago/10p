angular.module('tPsWeb')
  .service('seasonsService', seasonsService);

function seasonsService($http){
  return {
    getAllSeasons: function() {
      console.log('getAllSeasons running')
      var req = {
        method:'GET',
        url:'http://localhost:3000/seasons/',
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
