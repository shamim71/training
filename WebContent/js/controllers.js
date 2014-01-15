'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', []);

myAppControllers.controller('MyCtrl1', [ function() {

} ]);

myAppControllers.controller('ApplicationControllers', [ '$scope',

function($scope) {

	$scope.logged = false;

} ]);

