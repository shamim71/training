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
	  controller: 'CourseDetailsController',
	  access: access.anon
  });
  
  $routeProvider.when('/course-details', {
	  templateUrl: 'partials/course_details.html', 
	  controller: 'CourseDetailsController',
	  access: access.user
  });
  
  $routeProvider.when('/course-list', {
	  templateUrl: 'partials/courses.html', 
	  controller: 'CourseListControllers',
	  access: access.user
  });
  
  $routeProvider.when('/enrollment-list', {
	  templateUrl: 'partials/enrollments.html', 
	  controller: 'EnrollmentListControllers',
	  access: access.user
  });
  
  $routeProvider.when('/register', {
	  templateUrl: 'partials/register.html', 
	  controller: 'RegistrationControllers',
	  access: access.anon
  });
  
  $routeProvider.when('/login', {
	  templateUrl: 'partials/login.html', 
	  controller: 'LoginControllers',
	  access: access.anon
  });
  
  $routeProvider.when('/mycourses/:userId', {
	  templateUrl: 'partials/mycourses.html', 
	  controller: 'MyCourseControllers',
	  access: access.user
  });
  
  $routeProvider.when('/completed/:userId', {
	  templateUrl: 'partials/myfinishedcourses.html', 
	  controller: 'MyFinishedCourseControllers',
	  access: access.user
  });
  $routeProvider.when('/test-reports', {
	  templateUrl: 'partials/test_reports.html', 
	  controller: 'TestReportControllers',
	  access: access.user
  });
  $routeProvider.when('/viewcourse/:id', {
	  templateUrl: 'partials/training.html', 
	  controller: 'SlideViewControllers',
	  access: access.user  
  });
  
  $routeProvider.when('/view/:id/enr/:enid', {
	  templateUrl: 'partials/view.html', 
	  controller: 'SlideViewCtrl',
	  access: access.user  
  });
  
  $routeProvider.when('/assign-course/:id', {
	  templateUrl: 'partials/user_course_assignment.html',
	  controller: 'UserCourseCtrl',
	  access: access.user  
  });
  $routeProvider.when('/add-enrollment', {
	  templateUrl: 'partials/user_course_enrollment.html',
	  controller: 'UserCourseEnrollmentCtrl',
	  access: access.user  
  }); 
  $routeProvider.when('/add-enrollment/:id', {
	  templateUrl: 'partials/user_course_enrollment.html',
	  controller: 'UserCourseEnrollmentCtrl',
	  access: access.user  
  });   
  $routeProvider.when('/course-exam/:id/test/:tid', {
	  templateUrl: 'partials/course_test.html',
	  controller: 'QuestionAnswerControllers',
	  access: access.user  
  });
  $routeProvider.when('/forgot-password', {
	  templateUrl: 'partials/forgotpass.html',
	  controller: 'ForgotPasswordControllers',
	  access: access.user  
  });  
  
  $routeProvider.when('/changepassword/:id', {
	  templateUrl: 'partials/changepass.html',
	  controller: 'ChangePasswordControllers',
	  access: access.user  
  });
  
  $routeProvider.when('/employee-list', {
	  templateUrl: 'partials/employees.html', 
	  controller: 'EmployeeListControllers',
	  access: access.user
  });
  
  $routeProvider.when('/employee-details/:id', {
	  templateUrl: 'partials/employee_details.html', 
	  controller: 'EmployeeDetailsController',
	  access: access.user
  });
  $routeProvider.when('/employee-details', {
	  templateUrl: 'partials/employee_details.html', 
	  controller: 'EmployeeDetailsController',
	  access: access.user
  });
  $routeProvider.otherwise({redirectTo: '/home'});
  
  }]);




