angular.module('tPsWeb')
  .controller('testCtrl', testCtrl);

testCtrl.$inject = ['$scope', '$state', 'commonFunctions', 'gamesService', 'seasonsService', 'predictionFunctions', '$q'];

function testCtrl($scope, $state, commonFunctions, gamesService, seasonsService, predictionFunctions, $q) {
var self = this;

self.user = $scope.user;

self.goHome = goHome;
function goHome() {
  $state.go('home');
}

}