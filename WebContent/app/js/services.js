'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
	var myAppServices = angular.module('myApp.services', [ 'ngResource' ]);
	
	var serviceRoot = 'http://localhost:8080/training-server';
	
	myAppServices.value('version', '0.1');


