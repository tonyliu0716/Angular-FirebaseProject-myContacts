'use strict';

// Declare app level module which depends on views, and components
angular.module('myContacts', [
  'ngRoute',
  'firebase',
  'myContacts.contacts'
]).
service('IconService', function () {
    this.login = {
        loginIcon: true,
        username: "",
        message: ""
    };
}).

config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/login', {
        templateUrl: "login/login.html",
        controller: "LoginController"
    });

    $routeProvider.otherwise({
        redirectTo: '/contacts'
    });
}]).

controller("mainController", ['$scope', 'IconService', '$firebaseAuth', '$location', function ($scope, IconService, $firebaseAuth, $location) {
    $scope.IconService = IconService;
    $scope.authObj = $firebaseAuth();
    //Log out
    $scope.logout = function () {
        $scope.authObj.$signOut();
        $scope.IconService.login.loginIcon = true;
        $scope.IconService.login.username = "";
        $scope.IconService.login.message = "Successful Logout! Welcome back next time..";
        $location.url("/contacts");
    }
}]).

controller("LoginController", ['$scope', '$log', '$firebaseAuth', '$location', 'IconService', function ($scope, $log, $firebaseAuth, $location, IconService) {
    $scope.authObj = $firebaseAuth();
    $scope.IconService = IconService;
    $scope.loginWithGithub = function () {
        //TODO: auth with firebase
        $log.info("I am here!");
        $scope.authObj.$signInWithPopup('github').then(function (authData) {
            $log.info(authData);
            //when the call back function run, we can display his name and password inside the input tab
            $scope.username = authData.user.displayName;
            $scope.email = authData.user.email;
            IconService.login.username = $scope.username;
            //fake password
            $scope.password = "123123123";

            //set time out 
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.IconService.login.loginIcon = false;
                    $location.url("/");
                })
            }, 800);
        }).catch(function (error) {
            $log.error(error);
        });
    }


}]);