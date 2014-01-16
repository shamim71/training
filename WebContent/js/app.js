'use strict';

var access = routingConfig.accessLevels;

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute','ngCookies',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider','$locationProvider','$httpProvider', function($routeProvider,$locationProvider,$httpProvider) {
  
  
  $routeProvider.when('/course-details/:param1', {
	  templateUrl: 'partials/course_details.html', 
	  controller: 'CourseDetailsController'
  });
  
  $routeProvider.when('/course-details', {
	  templateUrl: 'partials/course_details.html', 
	  controller: 'CourseDetailsController'
  });
  
  $routeProvider.when('/course-list', {
	  templateUrl: 'partials/courses.html', 
	  controller: 'CourseListControllers'
  });
  
  $routeProvider.when('/enrollment-list', {
	  templateUrl: 'partials/enrollments.html', 
	  controller: 'EnrollmentListControllers'
  });
  
  $routeProvider.when('/register', {
	  templateUrl: 'partials/register.html', 
	  controller: 'RegistrationControllers'
  });
  
  $routeProvider.when('/login', {
	  templateUrl: 'partials/login.html', 
	  controller: 'LoginControllers'
  });
  
  $routeProvider.when('/mycourses/:userId', {
	  templateUrl: 'partials/mycourses.html', 
	  controller: 'MyCourseControllers'
  });
  
  $routeProvider.when('/completed/:userId', {
	  templateUrl: 'partials/myfinishedcourses.html', 
	  controller: 'MyFinishedCourseControllers'
  });
  $routeProvider.when('/test-reports', {
	  templateUrl: 'partials/test_reports.html', 
	  controller: 'TestReportControllers'
  });
  
  $routeProvider.when('/inventory-txn-reports', {
	  templateUrl: 'partials/inventory_txn_reports.html', 
	  controller: 'InventoryReportController'
  });  
  
  $routeProvider.when('/viewcourse/:id', {
	  templateUrl: 'partials/training.html', 
	  controller: 'SlideViewControllers'
  });
  
  $routeProvider.when('/view/:id/enr/:enid', {
	  templateUrl: 'partials/view.html', 
	  controller: 'SlideViewCtrl'
  });
  
  $routeProvider.when('/assign-course/:id', {
	  templateUrl: 'partials/user_course_assignment.html',
	  controller: 'UserCourseCtrl'
  });
  $routeProvider.when('/add-enrollment', {
	  templateUrl: 'partials/user_course_enrollment.html',
	  controller: 'UserCourseEnrollmentCtrl'
  }); 
  $routeProvider.when('/add-enrollment/:id', {
	  templateUrl: 'partials/user_course_enrollment.html',
	  controller: 'UserCourseEnrollmentCtrl'
  });   
  $routeProvider.when('/course-exam/:id/test/:tid', {
	  templateUrl: 'partials/course_test.html',
	  controller: 'QuestionAnswerControllers'
  });
  $routeProvider.when('/forgot-password', {
	  templateUrl: 'partials/forgotpass.html',
	  controller: 'ForgotPasswordControllers'
  });  
  
  $routeProvider.when('/changepassword/:id', {
	  templateUrl: 'partials/changepass.html',
	  controller: 'ChangePasswordControllers'
  });
  
  $routeProvider.when('/employee-list', {
	  templateUrl: 'partials/employees.html', 
	  controller: 'EmployeeListControllers'
  });
  
  $routeProvider.when('/employee-details/:id', {
	  templateUrl: 'partials/employee_details.html', 
	  controller: 'EmployeeDetailsController'
  });
  $routeProvider.when('/employee-details', {
	  templateUrl: 'partials/employee_details.html', 
	  controller: 'EmployeeDetailsController'
  });
  $routeProvider.otherwise({redirectTo: '/home'});
  
  }]);




