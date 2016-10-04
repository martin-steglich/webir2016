'use strict';

// Declare app level module which depends on views, and components
angular.module('krypton', [
        'satellizer',
        'ngResource',
        'ngRoute',
        'ngProgress',
        'ui.bootstrap',
        'ui-notification',
        'ngtweet'
])
    //.constant('baseDataUrl', "http://localhost:8890/classify/api/")
    //.constant('baseDataUrl', "http://192.168.99.100:8890/classify/api/")
    .constant('baseDataUrl', "https://krypton.mgcoders.uy/classify/api/")



    .factory('TweetFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'tweet/unclassified/');
    })

    .factory('InfoFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'info/');
    })

    .factory('CassifyFactory', function ($resource, baseDataUrl) {
        return $resource(baseDataUrl + 'tweet/classify', {}, {
            save: {
                method: 'POST',
                cache: false,
                isArray: false,
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            }
        })
    })

    .controller('AppCtrl', ['$scope', 'TweetFactory', 'ngProgressFactory', 'CassifyFactory', '$route', '$location', 'Notification', 'InfoFactory', '$timeout', function ($scope, TweetFactory, ngProgressFactory, CassifyFactory, $route, $location, Notification, InfoFactory, $timeout) {

        $scope.progressbar = ngProgressFactory.createInstance();

        $scope.clases = ['NO_CLASIFICADO', 'NO_UTIL', 'POCO_UTIL', 'UTIL', 'MUY_UTIL'];

        $scope.tweetid = undefined;

        $scope.cargarTweet = function () {
            $scope.tweetid = undefined;
            TweetFactory.get({}).$promise.then(function (data) {
                $scope.tweet = data;
                if ($scope.tweet.error) {
                    $scope.progressbar.complete();
                    $scope.loading = false;
                } else {
                    $scope.tweetid = data.origin_id;
                    $scope.loadWidget();
                    $scope.progressbar.complete();
                    $scope.loading = false;
                    $scope.success = true;
                }
            });

        };

        $scope.loadWidget = function () {
                $timeout(function() {
                    if(angular.element(document.querySelector('post_' + $scope.tweetid)).find('iframe').length === 0) {
                        twttr.widgets.createTweet($scope.tweetid, document.getElementById('post_' + $scope.tweetid)).then(function(resp) {
                            $timeout(function() {
                                $scope.loading = false;
                            })
                        });
                    };
                }, 100);
        };

        $scope.eraseWidget = function(){
            document.getElementById('post_' + $scope.tweetid).innerHTML = '<div  id="{{\'post_\' + tweetid}}"></div>';
        }

        $scope.selectClassification = function (classification) {
            $scope.eraseWidget();
            $scope.tweet.krypton_category = classification;
            $scope.enviarTodo();
        }

        $scope.noClasificar = function () {
            $scope.eraseWidget();
            $scope.cargaInicio();
            $scope.cargarTweet();
            $scope.cargarInfo();
        };


        $scope.reloadRoute = function () {
            $location.path("/tweets");
        };

        $scope.enviarTodo = function () {
            CassifyFactory.save($scope.tweet).$promise.then(function (data) {
                console.info('Clasificado', data);
                Notification({message:'Clasificado, gracias!', positionY: 'bottom', positionX: 'right'});
                $scope.eraseWidget();
                $scope.cargaInicio();
                $scope.cargarTweet();
                $scope.cargarInfo();
            });
        };

        $scope.cargaInicio = function () {
            $scope.progressbar.start();
            $scope.loading = true;
            $scope.success = false;
            $scope.isCollapsed = false;
            $scope.othersuccess = false;
            $scope.pares = {};
            $scope.paresResto = {};
        };

        $scope.cargarInfo = function () {
            InfoFactory.get({}).$promise.then(function (data) {
                $scope.info = data;
            });
        }

        //Showtime
        $scope.cargaInicio();
        $scope.cargarTweet();
        $scope.cargarInfo();

    }])

    .controller('LoginCtrl', ['$scope','$auth','$location','Notification', function($scope, $auth, $location, Notification) {

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


    }])

    .config(['$locationProvider', '$routeProvider', '$httpProvider','$authProvider','baseDataUrl', function ($locationProvider, $routeProvider, $httpProvider, $authProvider, baseDataUrl) {
        $locationProvider.hashPrefix('!');
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = false;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

        $authProvider.loginUrl = baseDataUrl + 'login';
        $authProvider.tokenName = 'token';
        $authProvider.tokenPrefix = 'satellizerKrypton';
        $authProvider.signupUrl = baseDataUrl + 'signup';


        $routeProvider.when('/tweets', {
            templateUrl: 'partials/tweets.html',
            controller: 'AppCtrl'
        });

        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        });

        $routeProvider.when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'SignupCtrl'
        });



        $routeProvider.otherwise({redirectTo: '/login'});

        $locationProvider.html5Mode(true);
    }]);



