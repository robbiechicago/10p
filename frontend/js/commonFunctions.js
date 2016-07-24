angular.module('tPsWeb')
  .factory('commonFunctions', commonFunctions);


var self = this;

function sort_by_date(a,b) {
  if (a.date_of_first_saturday_fixture < b.date_of_first_saturday_fixture)
    return -1;
  if (a.date_of_first_saturday_fixture > b.date_of_first_saturday_fixture)
    return 1;
  return 0;
}

function commonFunctions($q, $http, seasonsService){
  return {
    api_call: function(method, url, data) {
      console.log('api call running...')
      var defer = $q.defer();
      var req = {
        method: method.toUpperCase(),
        url: 'http://ec2-52-33-185-209.us-west-2.compute.amazonaws.com:3000/' + url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }
      $http(req).success(function(data, status) {
        // console.log('testing....')
        // console.log(data)
        // console.log(status)
        // console.log(data.status)
        if (status === 200) {
          console.log('commonFunctions api_call success')
          defer.resolve(data);
        } else {
          defer.reject(data);
        }
      }).error(function(data){
        console.log('commonFunctions api_call error')
        defer.resolve(data)
      })
      return defer.promise;
    },
    getCurrentSeason: function(seasons) {
      console.log(seasons)
      var defer = $q.defer();
      var season_object = {};
      self.today = new Date()
      // self.today = new Date('2017-11-01')
      console.log(self.today)
      seasons.sort(sort_by_date);

      //CONVERT seasons OBJECT DATES FROM STRING TO DATE
      angular.forEach(seasons, function(v,i) {
        v.date_of_first_saturday_fixture = new Date(v.date_of_first_saturday_fixture);
        v.date_of_last_saturday_fixture = new Date(v.date_of_last_saturday_fixture);
      })
      console.log(seasons);

      if (self.today < seasons[0].date_of_first_saturday_fixture) {
        // console.log('today is pre-season 0')
        season_object = {
          season: seasons[0],
          close_season: true
        }
      } else if (self.today > seasons[seasons.length - 1].date_of_last_saturday_fixture) {
         // console.log('today is EITHER after the end of all seasons, or is in the last weekend of the last season')
         season_object = {
          season: null,
          close_season: true
        }
      } else {
        for (var i = 0; i < seasons.length; i++) {
          if (self.today > seasons[i].date_of_first_saturday_fixture && self.today < seasons[i].date_of_last_saturday_fixture) {
            // console.log('this is the current season')
            // console.log(seasons[i])
            season_object = {
              season: seasons[i],
              close_season: false
            }
          }
          if (self.today > seasons[i].date_of_last_saturday_fixture && self.today < seasons[i+1].date_of_first_saturday_fixture) {
            // console.log('this is the close-season')
            // console.log(seasons[i+1])
            season_object = {
              season: seasons[i+1],
              close_season: true
            }
          }
        }
      }
      defer.resolve(season_object);
      return defer.promise
    }, 
    getWeeks: function(season) {
      var defer = $q.defer()
      self.today = new Date()
      // self.today = new Date('2015-12-25')
      console.log('running get weeks')

      self.weeks = [];
      self.this_week = {};
      var not_yet = true;

      var mon = moment(season.date_of_first_saturday_fixture).subtract(5, 'days');
      var x = 1;
      while(mon._d < season.date_of_last_saturday_fixture) {
        var sun = new Date(moment(mon).add(6, 'days'))
        var week = {
          "season": season.season,
          "week": x,
          "week_start_mon": new Date(mon._d),
          "week_end_sun": new Date(moment(mon).add(6, 'days'))
        }
        self.weeks.push(week);

        //CHECK FOR AND CREATE THIS WEEK
        var next_mon = moment(mon._d).add(7, 'days');

        if (self.today > mon._d && self.today < next_mon._d) {
          self.this_week = {
            "season": season.season,
            "week": x,
            "week_start_mon": new Date(mon._d),
            "week_end_sun": new Date(moment(mon).add(6, 'days'))
          }
          not_yet = false;
        } else if (self.today > mon._d && self.today > next_mon._d) {
          not_yet = true;
        } else if (self.today < mon._d && self.today < next_mon._d && not_yet === true) {
          self.this_week = {
            "season": season.season,
            "week": x,
            "week_start_mon": new Date(mon._d),
            "week_end_sun": new Date(moment(mon).add(6, 'days'))
          }
          not_yet = false;
        }
        mon = moment(mon._d).add(7, 'days');
        console.log
        x++;
      }
      console.log(self.weeks)
      var return_obj = {weeks: self.weeks, this_week: self.this_week};
      defer.resolve(return_obj);
      return defer.promise
    }
  }
};
