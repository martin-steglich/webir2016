'use strict';

// Declare app level module which depends on views, and components
angular.module('App', ['ngResource','ngRoute', 'ngProgress', 'ui.bootstrap', 'ngRoute'])
    // //.constant('baseDataUrl', "http://localhost:8890/webir2016/api/")
     .constant('baseDataUrl', "http://192.168.99.100:8890/webir2016/api/")

    .factory('LeagueFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'leagues/');
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

    .controller('AppCtrl', ['$scope', 'LeagueFactory', 'MatchdayFactory', 'ngProgressFactory','$timeout',  function ($scope, LeagueFactory, MatchdayFactory, ngProgressFactory, timeout) {

        $scope.progressbar = ngProgressFactory.createInstance();

        $scope.getLeagues = function() {
            //console.log("GETLEAGUES");
            LeagueFactory.get({}).$promise.then(function (data) {
                $scope.leagues_response = data;
                if ($scope.leagues_response.error) {
                    console.log("ERROR");
                    console.log($scope.leagues_response.error);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    //console.log($scope.leagues_response);
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.leagues = $scope.leagues_response['leagues'];
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
        $scope.getLeagues();

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
                    $scope.numPerPageFixture = 5;
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



    /*.controller('LoginCtrl', ['$scope','$auth','$location','Notification', function($scope, $auth, $location, Notification) {

        $scope.email = null;
        $scope.password = null;
        $scope.login = function(){
            $auth.login({
                email: $scope.email,
                password: $scope.password
                })
                .then(function(){
                    // Si se ha logueado correctamente, lo tratamos aquí.
                    // Podemos también redirigirle a una ruta
                    $location.path("/tweets");
                })
                .catch(function(response){
                    // Si ha habido errores llegamos a esta parte
                    Notification.error({message: response.data.message, delay: 1000, positionY: 'bottom', positionX: 'right'})
                });
        }

        $scope.goSignup = function(){
            $location.path("/signup");
        }
    }])

    .controller('SignupCtrl', ['$scope','$auth','$location','Notification', function($scope, $auth, $location, Notification) {

        $scope.email = null;
        $scope.password = null;
        $scope.pin = null;
        $scope.signup = function(){
            $auth.signup({
                    email: $scope.email,
                    password: $scope.password,
                    pin: $scope.pin
                })
                .then(function(){
                    // Si se ha logueado correctamente, lo tratamos aquí.
                    // Podemos también redirigirle a una ruta
                    $location.path("/tweets");
                })
                .catch(function(response){
                    // Si ha habido errores llegamos a esta parte
                    Notification.error({message: response.data.message, delay: 1000, positionY: 'bottom', positionX: 'right'})
                });
        }
    }])
    */
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

        $routeProvider.when("/matchday/:league/:matchday", {
            templateUrl: "partials/league.html",
            controller: "MatchdayCtrl"
        });

        $routeProvider.when("/team/:team", {
            templateUrl: "partials/team.html",
            controller: "TeamCtrl"
        });

        $routeProvider.when("/match/:team1/:team2", {
            templateUrl: "partials/match.html",
            controller: "MatchNewsCtrl"
        });

        $locationProvider.html5Mode(true);
    }]);



