'use strict';

/* Directives */


var appDir = angular.module('myApp.directives', []);

appDir.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

	
	appDir.directive('myViewer', function() {
		return {
			template: 'Name:<p>Shamim Ahmmed</p>'
			};
		  
	  });
	
	/*appDir.directive('checkUser', ['$rootScope', '$location', 'UserService', function ($root, $location, UserService) {
		return {
			link: function (scope, elem, attrs, ctrl) {
				$root.$on('$routeChangeStart', function(event, currRoute, prevRoute){
					if (!prevRoute.access.isFree && !UserService.isLogged) {
						// reload the login route
						  $location.path('/login');
					}
					
					* IMPORTANT:
					* It's not difficult to fool the previous control,
					* so it's really IMPORTANT to repeat the control also in the backend,
					* before sending back from the server reserved information.
					
				});
			}
		}
	}]);	
	
	appDir.directive('accessLevel', ['UserService', function(UserService) {
	    return {
	        restrict: 'A',
	        link: function($scope, element, attrs) {
	            var prevDisp = element.css('display')
	                , userRole
	                , accessLevel;

	            $scope.appUser = UserService.appUser;
	            $scope.$watch('appUser', function(appUser) {
	                if(appUser.role)
	                    userRole = appUser.role;
	                updateCSS();
	            }, true);

	            attrs.$observe('accessLevel', function(al) {
	                if(al) accessLevel = $scope.$eval(al);
	                updateCSS();
	            });

	            function updateCSS() {
	                if(userRole && accessLevel) {
	                    if(!UserService.authorize(accessLevel, userRole))
	                        element.css('display', 'none');
	                    else
	                        element.css('display', prevDisp);
	                }
	            	console.debug("Updating css...");
	            }
	        }
	    };
	}]);	
	
*/