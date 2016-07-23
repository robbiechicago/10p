angular.module('tPsWeb')
  .controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope', '$state', 'commonFunctions', 'gamesService', 'seasonsService', 'predictionFunctions', '$q'];

function homeCtrl($scope, $state, commonFunctions, gamesService, seasonsService, predictionFunctions, $q) {
  console.log('hello!')
  var self = this;

  self.user = $scope.user;
  self.logged_in = $scope.logged_in;

  self.message = "this is the message";

  self.goals_options = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  self.points_options = [1,2,3,4,5,6,7,8,9,10];

  seasonsService.getAllSeasons().then(function(seasons) {
    self.seasons = seasons.data.seasons
    console.log(self.seasons);
    commonFunctions.getCurrentSeason(self.seasons).then(function(season) {
      self.season = season
      console.log(self.season);
      commonFunctions.getWeeks(self.season.season).then(function(weeks) {
        console.log(weeks);
        gamesService.getAllGames().then(function(games) {
          self.games = games.data.games
          console.log(self.games);
          self.current_week = weeks.this_week.week;

          self.home_goals = {}
          self.away_goals = {}
          self.hda = {}
          self.result_points = {"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1}
          self.score_points = {"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1}
          sum_points();

        })
      })
    })
  })

  self.sum_points = sum_points;
  function sum_points() {
    console.log('points change')
    self.points_total = 0
    for (var i in self.result_points) {
      self.points_total += parseInt(self.result_points[i])
    }
    for (var i in self.score_points) {
      self.points_total += parseInt(self.score_points[i])
    }
  }

  self.get_hda = get_hda;
  function get_hda() {
    console.log('hda change')
    for (var i in self.home_goals) {
      if (self.home_goals[i] >= 0 && self.away_goals[i] >= 0) {
        if (self.home_goals[i] > self.away_goals[i]) {
          self.hda[i] = "Home";
        } else if (self.home_goals[i] < self.away_goals[i]) {
          self.hda[i] = "Away";
        } else {
          self.hda[i] = "Draw";
        }
      }
    }
  }
  
  self.submit_predictions = submit_predictions;
  function submit_predictions() {
    console.log('checking predictions...')
    if ($scope.user) {
      var user = $scope.user
      var pred_obj = {
        user_id: user,
        season: self.season.season.season,
        week: self.current_week,
        home_goals: self.home_goals,
        away_goals: self.away_goals,
        result_points: self.result_points,
        score_points: self.score_points
      }
      predictionFunctions.post_predictions(pred_obj).then(function() {
        console.log('supposedly done, yo')
      })
    } else {
      console.log('no user.  Sheeeeeeet')
    }
  }

  self.goTest = goTest;
  function goTest() {
    $state.go('test');
  }

}