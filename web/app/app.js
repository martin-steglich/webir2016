'use strict';

// Declare app level module which depends on views, and components
angular.module('App', ['ngResource','ngRoute', 'ngProgress', 'ui.bootstrap'])
    // //.constant('baseDataUrl', "http://localhost:8890/webir2016/api/")
     .constant('baseDataUrl', "http://192.168.99.100:8890/webir2016/api/")

    .factory('LeagueFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'leagues/');
    })

    .factory('TeamFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'teaminfo/');
    })

    .factory('MatchdayFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'leaguematchday');
    })

    .factory('NewsFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'teamnews');
    })

    .controller('AppCtrl', ['$scope', 'LeagueFactory', 'ngProgressFactory','$timeout',  function ($scope, LeagueFactory, ngProgressFactory, timeout) {

        $scope.progressbar = ngProgressFactory.createInstance();
        // $scope.leagues = [
        //     {
        //         Driver: {
        //             givenName: 'Sebastian',
        //             familyName: 'Vettel'
        //         },
        //         points: 322,
        //         nationality: "German",
        //         Constructors: [
        //             {name: "Red Bull"}
        //         ]
        //     },
        //     {
        //         Driver: {
        //             givenName: 'Fernando',
        //             familyName: 'Alonso'
        //         },
        //         points: 207,
        //         nationality: "Spanish",
        //         Constructors: [
        //             {name: "Ferrari"}
        //         ]
        //     }
        // ];

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
                    $scope.leagues = $scope.leagues_response['leagues']
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

    .controller('IndexCtrl', ['$rootScope','$location', function($rootScope, $location) {

        $rootScope.changeView = function(view) {
            $location.path(view);
        }


    }])*/

    // .config(['$locationProvider', '$routeProvider', '$httpProvider','$authProvider','baseDataUrl', function ($locationProvider, $routeProvider, $httpProvider, $authProvider, baseDataUrl) {
    //     $locationProvider.hashPrefix('!');
    //     $httpProvider.defaults.useXDomain = true;
    //     $httpProvider.defaults.withCredentials = false;
    //     delete $httpProvider.defaults.headers.common["X-Requested-With"];
    //     $httpProvider.defaults.headers.common["Accept"] = "application/json";
    //     $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    //
    //     $authProvider.loginUrl = baseDataUrl + 'login';
    //     $authProvider.tokenName = 'token';
    //     $authProvider.tokenPrefix = 'satellizerKrypton';
    //     $authProvider.signupUrl = baseDataUrl + 'signup';
    //
    //
    //     $routeProvider.when('/tweets', {
    //         templateUrl: 'partials/tweets.html',
    //         controller: 'AppCtrl'
    //     });
    //
    //     $routeProvider.when('/login', {
    //         templateUrl: 'partials/login.html',
    //         controller: 'LoginCtrl'
    //     });
    //
    //     $routeProvider.when('/signup', {
    //         templateUrl: 'partials/signup.html',
    //         controller: 'SignupCtrl'
    //     });
    //
    //
    //     $locationProvider.html5Mode(true);
    // }]);



