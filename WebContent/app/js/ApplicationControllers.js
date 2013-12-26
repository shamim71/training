'use strict';

	/* Controllers */
	
	var myAppControllers = angular.module('myApp.ApplicationControllers', []);
	
	myAppControllers.controller('AppControllers', [ '$scope',
	
	function($scope) {
	
		$scope.logged = false;
	
	}]);
