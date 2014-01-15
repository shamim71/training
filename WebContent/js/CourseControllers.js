'use strict';

/* Controllers */

	var myAppControllers = angular.module('myApp.controllers', ['ngSanitize']);
	
	myAppControllers.controller('CourseDetailsController',['$scope','$routeParams','$location', 'TrainingCourse', 
	  function($scope, $routeParams, $location,TrainingCourse) {
			
		  var param1 = $routeParams.param1;
		  $scope.courseAction = 0;
		  $scope.message = '';
		  $scope.showMessage = false;
		  $scope.messageClass = 'alert-success';
		  //$scope.course = {};
		  
		  if(param1 != null && param1 != 'undefined'){
			  console.debug("Load course with course id "+param1);
			  $scope.courseAction = 1;
			  $scope.course = TrainingCourse.get({id: param1});
		  }
		  
		  $scope.save = function (course) {
			  $scope.showMessage = true;
			  /** Create */
			  if($scope.courseAction == 0){	
				  
				  TrainingCourse.save({}, course,
						  
				  function(u, responseHeaders) {
					  $scope.message = "Record successfully created";
					  $scope.messageClass = 'alert-success';
					  
					},	  
				  function(httpResponse){
						$scope.message = httpResponse.data.result;
						$scope.messageClass = 'alert-danger';
				  });
				  
			  }
			  /** Update */
			  else if($scope.courseAction == 1){

				  TrainingCourse.save({id: course.id}, course,
						  
				  function(u, responseHeaders) {

			  		$scope.message = "Record successfully updated";
					$scope.messageClass = 'alert-success';
					//$scope.course = course; 
					
					},	  
				  function(httpResponse){
						$scope.message = httpResponse.data.result;
						$scope.messageClass = 'alert-danger';
				  });
			
			  }
		  };

		    $scope.back = function () {
		    	$location.path('/course-list');
		    };	
		    
		}]);
	
	myAppControllers.controller('CourseListControllers', ['$scope','$filter','$location','TrainingCourse',
	    function($scope, $filter, $location, TrainingCourse) {
			
			$scope.courses = TrainingCourse.query();	

		    $scope.orderProp = 'code';
		    
		    $scope.addCourse = function () {
		    	$location.path('/course-details');
		    };
		    
		    $scope.deleteCourse = function (id) {
		    	TrainingCourse.remove({id: id}, {},
						  
				  function(u, responseHeaders) {

			  		$scope.message = "Record successfully deleted";
					$scope.messageClass = 'alert-success';
					 
					 /** Re-populate the model */
					 
					 $scope.courses = TrainingCourse.query();
					 
					},	  
				  function(httpResponse){
						$scope.message = httpResponse.data.result;
						$scope.messageClass = 'alert-danger';
				  });
		    };

		   
	  }]);
			