'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var myAppServices = angular.module('myApp.services', [ 'ngResource' ]);

 var serviceRoot = 'http://d1mnzch1.versacomllc.com:9080/quickbooks-gateway-server';
//var serviceRoot = 'http://dalqbase1.versacomllc.com:8080/training-server';

myAppServices.value('version', '0.1');

myAppServices.factory('Courses', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/courses', {}, {
		query : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

myAppServices.factory('TrainingCourse', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/courses/:id', {
		id : '@id'
	}, /** Parameters */
	{
		query : {
			method : 'GET',
			params : {},
			isArray : true
		}

	});

} ]);

myAppServices.factory('EnrollmentTestService', [ '$resource',
		function($resource) {
			return $resource(serviceRoot + '/tests/:id', {
				id : '@id'
			}, /** Parameters */
			{
				query : {
					method : 'GET',
					params : {},
					isArray : false
				}

			});

		} ]);

myAppServices.factory('CourseAssignment', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/course/:id/enrollments', {
		id : '@id'
	}, /** Parameters */
	{
		query : {
			method : 'GET',
			params : {},
			isArray : true
		},
		assign : {

			method : 'POST',
			params : {}
		}

	});

} ]);

myAppServices.factory('Users', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/registration', {}, {
		register : {
			method : 'POST',
			params : {}
		}
	});

} ]);

myAppServices.factory('Employees', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/employees/:id?type=:type', { type : '@type', id: '@id'} /** Parameters */
	,{
		query : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});

} ]);

myAppServices.factory('Authentication', [ '$resource', function($resource) {

	return $resource(serviceRoot + '/authenticate', {}, {
		login : {
			method : 'POST',
			params : {}
		}
	});

} ]);

myAppServices.factory('ChangePassword', [ '$resource', function($resource) {

	return $resource(serviceRoot + '/changepassword/:id', {id : '@id'}, {
		change : {
			method : 'POST',
			params : {}
		}
	});

} ]);

myAppServices
		.factory(
				'UserService',
				[
						'$cookieStore',
						function($cookieStore) {

							var accessLevels = routingConfig.accessLevels, userRoles = routingConfig.userRoles, currentUser = $cookieStore
									.get('user')
									|| {
										username : '',
										role : userRoles.public
									};

							$cookieStore.remove('user');
							var logged = false;
							var userid = -1;
							var role = 'anon';
							function changeUser(user) {
								_.extend(currentUser, user);
							}
							;

							return {
								authorize : function(accessLevel, role) {
									if (role === undefined)
										role = currentUser.role;

									return accessLevel.bitMask & role.bitMask;
								},
								isLoggedIn : function() {
									logged = $cookieStore.get('authenticated');
									if (logged == undefined) {
										logged = false;
									}
									return logged;
								},
								getRole : function() {
									role = $cookieStore.get('role');
									if (role == undefined) {
										role = 'anon';
									}
									return role;
								},
								getUserId : function() {
									userid = $cookieStore.get('id');
									if (userid == undefined) {
										userid = -1;
									}
									return userid;
								},
								performLogout : function() {
									$cookieStore.remove('authenticated');
									logged = false;
									$cookieStore.remove('name');
									$cookieStore.remove('role');
									$cookieStore.remove('id');
									userid = null;
									role = 'anon';
								},
								accessLevels : accessLevels,
								userRoles : userRoles,
								Logged : logged,
								UserId : userid,
								Role : role,
								appUser : currentUser
							};
						} ]);

myAppServices.factory('Page', function() {
	var title = 'default';
	var viewMyHome = true;
	return {
		title : function() {
			return title;
		},
		setTitle : function(newTitle) {
			title = newTitle;
		},
		viewMyHome : function() {
			return viewMyHome;
		},
		setViewMyHome : function(val) {
			viewMyHome = val;
		},
		rootURL: function(){
			return serviceRoot;
		}
	};
});

myAppServices.factory('Enrollment', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/enrollments/user/:id', {
		id : '@id'
	}, /** Parameters */
	{
		query : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});

} ]);

myAppServices.factory('CourseEnrollment', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/course/enrollments/:id', {
		id : '@id'
	}, /** Parameters */
	{
		query : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});

} ]);

myAppServices.factory('QuestionAnswer', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/course/:id/questions', {
		id : '@id'
	}, /** Parameters */
	{
		query : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});

} ]);

myAppServices.factory('UserEnrollmentTest', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/enrollment/test/users/:id', {
		id : '@id'
	}, /** Parameters */
	{
		query : {
			method : 'GET',
			params : {},
			isArray : true
		}	
	});

} ]);

myAppServices.factory('TestReports', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/test/reports', {
		
	}, /** Parameters */
	{
		search : {
			method : 'POST',
			params : {},
			isArray : true
		}		
	});

} ]);

myAppServices.factory('LostPassword', [ '$resource', function($resource) {

	return $resource(serviceRoot + '/lostpassword', {}, {
		lostpass : {
			method : 'POST',
			params : {}
		}
	});

} ]);

myAppServices.factory('InventoryReports', [ '$resource', function($resource) {
	return $resource(serviceRoot + '/inventory/adjustment/report', {
		
	}, /** Parameters */
	{
		search : {
			method : 'POST',
			params : {},
			isArray : true
		}		
	});

} ]);
