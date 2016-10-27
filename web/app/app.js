'use strict';

// Declare app level module which depends on views, and components
angular.module('App', ['ngResource','ngRoute', 'ngProgress', 'ui.bootstrap', 'ngRoute'])
    // //.constant('baseDataUrl', "http://localhost:8890/webir2016/api/")
     .constant('baseDataUrl', "http://192.168.99.100:8890/webir2016/api/")

    .factory('LeagueFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'leagues/');
    })

    .factory('TeamFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'teaminfo/');
    })

    .factory('MatchdayFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'leaguematchday', {});
    })

    .factory('NewsFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'teamnews');
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




        //
        //
        // $scope.cargaInicio = function () {
        //     console.log("CARGAINICIO");
        //     $scope.progressbar.start();
        //     $scope.loading = true;
        //     $scope.success = false;
        // };
        //
        // //Showtime
        //$scope.cargaInicio();
        $scope.progressbar.start();
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
                    $scope.league_id = $scope.matchday_response['league_id'];
                    $scope.next_matchday = parseInt($scope.matchday_num) + 1;
                    $scope.prev_matchday = parseInt($scope.matchday_num) - 1;
                }
            });
        };



        //
        //
        // $scope.cargaInicio = function () {
        //     console.log("CARGAINICIO");
        //     $scope.progressbar.start();
        //     $scope.loading = true;
        //     $scope.success = false;
        // };
        //
        // //Showtime
        //$scope.cargaInicio();
        $scope.progressbar.start();
        $scope.getMatchday();


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

        $locationProvider.html5Mode(true);
    }]);



