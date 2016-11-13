'use strict';

// Declare app level module which depends on views, and components
angular.module('App', ['ngResource','ngRoute', 'ngProgress', 'ui.bootstrap', 'ngRoute', 'ngAnimate', 'ngSanitize'])
    // //.constant('baseDataUrl', "http://localhost:8890/webir2016/api/")

    .constant('baseDataUrl', "http://192.168.99.100:8890/webir2016/api/")

    .factory('SearchFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'search/');
    })

    .factory('TeamFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'teaminfo', {});
    })

    .factory('MatchdayFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'leaguematchday', {});
    })

    .factory('NewsFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'teamnews', {});
    })

    .factory('MatchNewsFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'matchnews', {});
    })

    .factory('LeagueNewsFactory', function($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'leaguenews', {});
    })

    .factory('TeamsFactory', function($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'teams/');
    })

    .factory('LeagueFactory', function($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'league/', {});
    })

    .controller('AppCtrl', ['$scope', 'SearchFactory', 'MatchdayFactory', 'LeagueNewsFactory' ,'TeamsFactory','ngProgressFactory','$http', '$location','$timeout',  function ($scope, SearchFactory, MatchdayFactory, LeagueNewsFactory, TeamsFactory, ngProgressFactory, $http, $location, timeout) {

        $scope.progressbar = ngProgressFactory.createInstance();

        $scope.getSearchLists = function() {
            SearchFactory.get({}).$promise.then(function (data) {
                $scope.teams_response = data;
                if ($scope.teams_response.error) {
                    console.log("ERROR");
                    console.log($scope.teams_response.error);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    //console.log($scope.leagues_response);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.items = $scope.teams_response['search'];

                }
            });
        };

        var _selected;

        $scope.selected = undefined;

        $scope.ngModelOptionsSelected = function(value) {
            if (arguments.length) {
                _selected = value;
            } else {
                return _selected;
            }
        };

        $scope.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };


        //$scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];



        $scope.redirectTeam = function(item) {
            if(item.type == 'EQUIPO')
                $location.path('/team/' + item.id);
            else
                $location.path('/league/' + item.id + '/' + item.matchday);
        };



        $scope.cargaInicio = function () {
            console.log("CARGAINICIO");
            $scope.progressbar.start();
            $scope.loading = true;
            $scope.success = false;
        };

        //Showtime
        $scope.cargaInicio();
        $scope.getSearchLists();
        // $scope.getTeams();

    }])

    .controller('MatchdayCtrl', ['$scope', 'MatchdayFactory', 'ngProgressFactory', '$timeout','$routeParams', function($scope, MatchdayFactory, ngProgressFactory, timeout, $routeParams){
        $scope.progressbar = ngProgressFactory.createInstance();

        $scope.league = $routeParams.league;
        $scope.matchday = $routeParams.matchday;

        $scope.getMatchday = function() {
            //console.log("GETLEAGUES");
            MatchdayFactory.get({league:$scope.league,matchday:$scope.matchday}).$promise.then(function (data) {
                $scope.matchday_response = data;
                if ($scope.matchday_response.error) {
                    console.log("ERROR");
                    console.log($scope.matchday_response.error);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    //console.log($scope.leagues_response);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                    console.log($scope.matchday_response['matchday']);
                    console.log($scope.matchday_response['league_name']);
                    $scope.matchday_num = $scope.matchday_response['matchday'];
                    $scope.matchday = $scope.matchday_response['fixtures'];
                    $scope.league_name = $scope.matchday_response['league_name'];
                    $scope.league_logo = $scope.matchday_response['league_logo'];
                    $scope.league_id = $scope.matchday_response['league_id'];
                    $scope.next_matchday = parseInt($scope.matchday_num) + 1;
                    $scope.prev_matchday = parseInt($scope.matchday_num) - 1;


                }
            });
        };



        $scope.cargaInicio = function () {
            console.log("CARGAINICIO");
            $scope.progressbar.start();
            $scope.loading = true;
            $scope.success = false;
        };

        //Showtime
        $scope.cargaInicio();
        $scope.getMatchday();


    }])

    .controller('TeamCtrl', ['$scope', 'TeamFactory','NewsFactory', 'ngProgressFactory', '$timeout','$routeParams', function($scope, TeamFactory, NewsFactory, ngProgressFactory, timeout, $routeParams){
        $scope.progressbar = ngProgressFactory.createInstance();

        $scope.team = $routeParams.team;

        $scope.getTeamInfo = function() {
            //console.log("GETLEAGUES");
            $scope.sortType = 'player.jerseyNumber';
            TeamFactory.get({team:$scope.team}).$promise.then(function (data) {
                $scope.team_response = data;
                if ($scope.team_response.error) {
                    console.log("ERROR");
                    console.log($scope.team_response.error);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    //console.log($scope.leagues_response);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                    // console.log($scope.matchday_response['matchday']);
                    // console.log($scope.matchday_response['league_name']);
                    $scope.team_name = $scope.team_response['name'];
                    $scope.team_logo = $scope.team_response['logo'];
                    $scope.team_fixtures = $scope.team_response['team_fixtures'];
                    $scope.team_players = $scope.team_response['team_players'];
                    $scope.team_squad_market_value = $scope.team_response['squadMarketValue'];

                    $scope.currentPageFixture = 1;
                    $scope.totalItemsFixture = $scope.team_fixtures['count'];
                    $scope.numPerPageFixture = 11;
                    $scope.currentPagePlayers = 1;
                    $scope.totalItemsPlayers = $scope.team_players['count'];
                    $scope.numPerPagePlayers = 5;
                    $scope.paginateFixture = function (value) {
                        var begin, end, index;
                        begin = ($scope.currentPageFixture - 1) * $scope.numPerPageFixture;
                        end = begin + $scope.numPerPageFixture;
                        index = $scope.team_fixtures['fixtures'].indexOf(value);
                        return (begin <= index && index < end);
                    };
                    $scope.paginatePlayers = function (value) {
                        var begin, end, index;
                        begin = ($scope.currentPagePlayers - 1) * $scope.numPerPagePlayers;
                        end = begin + $scope.numPerPagePlayers;
                        index = $scope.team_players['players'].indexOf(value);
                        return (begin <= index && index < end);
                    };
                }
            });
        };

        $scope.getTeamNews = function() {
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;
            $scope.active = 0;
            var slides = $scope.slides = [];
            var currIndex = 0;
            //console.log("GETLEAGUES");
            NewsFactory.get({team:$scope.team}).$promise.then(function (data) {
                $scope.news_response = data;
                if ($scope.news_response.error) {
                    console.log("ERROR");
                    console.log($scope.team_response.error);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    //console.log($scope.leagues_response);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                    // console.log($scope.matchday_response['matchday']);
                    // console.log($scope.matchday_response['league_name']);
                    $scope.team_news = $scope.news_response['team_news'];
                }
            });
        };


        $scope.cargaInicio = function () {
            console.log("CARGAINICIO");
            $scope.progressbar.start();
            $scope.loading = true;
            $scope.success = false;
        };

        //Showtime
        $scope.cargaInicio();
        $scope.getTeamInfo();
        $scope.getTeamNews();


    }])

    .controller('MatchNewsCtrl', ['$scope', 'MatchNewsFactory', 'ngProgressFactory', '$timeout','$routeParams', function($scope, MatchNewsFactory, ngProgressFactory, timeout, $routeParams){
        $scope.progressbar = ngProgressFactory.createInstance();

        $scope.team1 = $routeParams.team1;
        $scope.team2 = $routeParams.team2;

        $scope.getMatchNews = function(){
            $scope.myInterval1 = 5000;
            $scope.noWrapSlides1 = false;
            $scope.active1 = 0;
            $scope.myInterval2 = 5000;
            $scope.noWrapSlides2 = false;
            $scope.active2 = 0;
            MatchNewsFactory.get({team1:$scope.team1, team2:$scope.team2}).$promise.then(function (data) {
                $scope.matchnews_response = data;
                if($scope.matchnews_response.error){
                    console.log("ERROR");
                    console.log($scope.matchnews_response.error);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.match = $scope.matchnews_response['match'];

                    $scope.title = $scope.match['homeTeamName'];
                    if ($scope.match['result']['goalsHomeTeam'] != null && $scope.match['result']['goalsHomeTeam'] != "null")
                        $scope.title += " " + $scope.match['result']['goalsHomeTeam'];

                    $scope.title += " - " ;

                    if($scope.match['result']['goalsAwayTeam'] != null && $scope.match['result']['goalsAwayTeam'] != "null")
                        $scope.title += $scope.match['result']['goalsAwayTeam'] + " ";

                    $scope.title += $scope.match['awayTeamName'];

                    $scope.team1 = $scope.matchnews_response['team1'];
                    $scope.team2 = $scope.matchnews_response['team2'];
                    $scope.matches = $scope.matchnews_response['matches'];

                }
            })
        }

        $scope.cargaInicio = function () {
            console.log("CARGAINICIO");
            $scope.progressbar.start();
            $scope.loading = true;
            $scope.success = false;
        };

        //Showtime
        $scope.cargaInicio();
        $scope.getMatchNews();


    }])

    .controller('TypeaheadCtrl', ['$scope', '$http', '$location', 'TeamsFactory', 'ngProgressFactory','$timeout', function($scope, $http, $location, TeamsFactory, ngProgressFactory, timeout) {

        $scope.progressbar = ngProgressFactory.createInstance();


        var _selected;

        $scope.selected = undefined;

        $scope.ngModelOptionsSelected = function(value) {
            if (arguments.length) {
                _selected = value;
            } else {
                return _selected;
            }
        };

        $scope.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };
        $scope.getTeams = function() {
            //console.log("GETLEAGUES");
            TeamsFactory.get({}).$promise.then(function (data) {
                $scope.teams_response = data;
                if ($scope.teams_response.error) {
                    console.log("ERROR");
                    console.log($scope.teams_response.error);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    //console.log($scope.leagues_response);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.teams = $scope.teams_response['teams'];

                }
            });
        };


        //$scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];



        $scope.redirectTeam = function(team) {
            $location.path('/team/' + team.team_id);
        };

        $scope.cargaInicio = function () {
            console.log("CARGAINICIO");
            $scope.progressbar.start();
            $scope.loading = true;
            $scope.success = false;
        };

        //Showtime
        $scope.cargaInicio();
        $scope.getTeams();

    }])

    .controller('LeagueCtrl', ['$scope', 'LeagueFactory', 'ngProgressFactory', '$timeout','$routeParams', function($scope, LeagueFactory, ngProgressFactory, timeout, $routeParams){
        $scope.progressbar = ngProgressFactory.createInstance();

        $scope.league = $routeParams.league;
        $scope.matchday = $routeParams.matchday;

        $scope.getLeague = function() {
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;
            $scope.active = 0;
            //console.log("GETLEAGUES");
            LeagueFactory.get({league:$scope.league,matchday:$scope.matchday}).$promise.then(function (data) {
                $scope.league_response = data;
                if ($scope.league_response.error) {
                    console.log("ERROR");
                    console.log($scope.league_response.error);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    //console.log($scope.leagues_response);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                    console.log($scope.league_response['matchday']);
                    console.log($scope.league_response['league_name']);
                    $scope.matchday_num = $scope.league_response['matchday'];
                    $scope.matchday = $scope.league_response['fixtures'];
                    $scope.league_name = $scope.league_response['league_name'];
                    $scope.league_logo = $scope.league_response['league_logo'];
                    $scope.league_id = $scope.league_response['league_id'];
                    $scope.league_standing = $scope.league_response['league_standing'];
                    $scope.league_news = $scope.league_response['league_news'];
                    $scope.next_matchday = parseInt($scope.matchday_num) + 1;
                    $scope.prev_matchday = parseInt($scope.matchday_num) - 1;


                }
            });
        };



        $scope.cargaInicio = function () {
            console.log("CARGAINICIO");
            $scope.progressbar.start();
            $scope.loading = true;
            $scope.success = false;
        };

        //Showtime
        $scope.cargaInicio();
        $scope.getLeague();


    }])


    .controller('IndexCtrl', ['$rootScope','$location', function($rootScope, $location) {

        $rootScope.changeView = function(view) {
            $location.path(view);
        }


    }])



    .config(['$locationProvider', '$routeProvider','baseDataUrl', function ($locationProvider, $routeProvider, baseDataUrl) {

        $routeProvider.when("/", {
            templateUrl: "partials/leagues.html",
            controller: "AppCtrl"
        });

        $routeProvider.when("/league/:league/:matchday", {
            templateUrl: "partials/league.html",
            controller: "LeagueCtrl"
        });

        $routeProvider.when("/team/:team", {
            templateUrl: "partials/team.html",
            controller: "TeamCtrl"
        });

        $routeProvider.when("/match/:team1/:team2", {
            templateUrl: "partials/match.html",
            controller: "MatchNewsCtrl"
        });

        $routeProvider.when("/search", {
            templateUrl: "partials/search.html",
            controller: "TypeaheadCtrl"
        });

        $locationProvider.html5Mode(true);
    }]);



