'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', [ 'ngSanitize' ]);

myAppControllers
		.controller(
				'RegistrationControllers',
				[
						'$scope',
						'$routeParams',
						'$location',
						'$sce',
						'$cookieStore',
						'Users',
						'Authentication',
						'UserService',
						'Page',

						function($scope, $routeParams, $location, $sce,
								$cookieStore, Users, Authentication,
								UserService, Page) {

							$scope.message = '';
							$scope.showMessage = false;
							$scope.messageClass = 'alert-success';
							$scope.user = {};
							Page.setTitle('Registration Page');

							$scope.save = function(user) {
								$scope.showMessage = true;
								$scope.message = "Please wait...";
								Users
										.register(
												{},
												user,
												function(u, responseHeaders) {
													$scope.message = "User registration completed successfully";
													$scope.messageClass = 'alert-success';

												},
												function(httpResponse) {
													$scope.message = httpResponse.data.result;
													$scope.messageClass = 'alert-danger';
												});
							};

							$scope.back = function() {
								$location.path('/login');
							};

						} ]);

myAppControllers.controller('LoginControllers', [
		'$scope',
		'$routeParams',
		'$location',
		'$cookieStore',
		'Authentication',
		'UserService',
		'Page',

		function($scope, $routeParams, $location, $cookieStore, Authentication,
				UserService, Page) {

			$scope.message = '';
			$scope.showMessage = false;
			$scope.messageClass = 'alert-success';
			$scope.user = {};
			Page.setTitle('Login Page');

			$scope.login = function(user) {

				$scope.message = '';
				Authentication.login({}, user,

				function(u, responseHeaders) {
					$scope.showMessage = true;
					$scope.message = "User successfully logged in";
					$scope.messageClass = 'alert-success';

					UserService.Logged = true;
					UserService.UserId = u.result.id;
					UserService.Role = u.result.role;

					$cookieStore.put('id', u.result.id);
					$cookieStore.put('role', u.result.role);
					$cookieStore.put('authenticated', true);
					$cookieStore.put('name', u.result.firstName + " "
							+ u.result.lastName);

					$scope.currentUserId = u.result.id;

					if (UserService.Role == 'user') {
						$location.path('/mycourses/' + $scope.currentUserId);
					} else if (UserService.Role == 'admin') {
						$location.path('/course-list');
					}

				},

				function(httpResponse) {

					$scope.showMessage = true;
					UserService.Logged = false;

					if (httpResponse.data
							&& httpResponse.data.code == '401') {
						$scope.message = "Invalid user/password";
					} else {
						$scope.message = httpResponse.data.message;
					}

					$scope.messageClass = 'alert-danger';
				});
			};

		} ]);

myAppControllers.controller('MyCourseControllers', [ '$scope', '$routeParams',
		'$location', 'Enrollment', 'Page',

		function($scope, $routeParams, $location, Enrollment, Page) {

			Page.setTitle('My courses');
			var userId = $routeParams.userId;

			$scope.mycourses = {};

			if (userId != null && userId != 'undefined') {
				console.log("Load enrollment for user id " + userId);
				$scope.mycourses = Enrollment.query({
					id : userId
				});
			}

			$scope.viewCourse = function(id) {
				$location.path('/course-details');
			};

		} ]);

myAppControllers.controller('MyFinishedCourseControllers', [ '$scope',
		'$routeParams', '$location', 'UserEnrollmentTest', 'Page',

		function($scope, $routeParams, $location, UserEnrollmentTest, Page) {

			Page.setTitle('My finished courses');

			var userId = $routeParams.userId;
			$scope.basePath = Page.rootURL();
			$scope.enrollments = {};

			if (userId != null && userId != 'undefined') {
				console.log("Load enrollment for user id " + userId);
				$scope.enrollments = UserEnrollmentTest.query({
					id : userId
				});
			}

		} ]);

myAppControllers
		.controller(
				'TestReportControllers',
				[
						'$scope',
						'$routeParams',
						'$location',
						'TestReports',
						'Page',
						'TrainingCourse',
						function($scope, $routeParams, $location, TestReports,
								Page, TrainingCourse) {

							Page.setTitle('Training test reports');

							$scope.basePath = Page.rootURL();
							$scope.enrollments = {};
							$scope.filter = {};
							$scope.selection = [];
							$scope.courses = [];

							$scope.orderProp = 'code';
							// $scope.sortingOrder = 'code';
							$scope.reverse = false;
							$scope.filteredItems = [];
							$scope.groupedItems = [];
							$scope.itemsPerPage = 10;
							$scope.pagedItems = [];
							$scope.currentPage = 0;

							$scope.showPager = true;

							TestReports.search($scope.filter, function(
									enrollments) {
								console.log("Loaded all enrollments "
										+ enrollments.length);
								$scope.enrollments = enrollments;
								$scope.search();
							});

							TrainingCourse.query({}, function(courses) {
								$scope.courses = courses;
							});

							$scope.executeSearch = function() {
								console.log("Applying custom filters...");
								$scope.filter.courseIds = $scope.selection;

								TestReports.search($scope.filter, function(
										enrollments) {
									console.log("Loaded all enrollments "
											+ enrollments.length);
									$scope.enrollments = enrollments;
									$scope.search();
								});

							};

							$scope.toggleSelection = function toggleSelection(
									id) {
								var idx = $scope.selection.indexOf(id);

								// is currently selected
								if (idx > -1) {
									$scope.selection.splice(idx, 1);
								}

								// is newly selected
								else {
									$scope.selection.push(id);
								}
							};
							// init the filtered items
							$scope.search = function() {
								$scope.showPager = true;
								if ($scope.enrollments.length <= $scope.itemsPerPage) {
									$scope.showPager = false;
								}
								$scope.currentPage = 0;
								// now group by pages
								$scope.groupToPages();
							};
							// calculate page in place
							$scope.groupToPages = function() {
								$scope.pagedItems = [];

								for (var i = 0; i < $scope.enrollments.length; i++) {
									if (i % $scope.itemsPerPage === 0) {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)] = [ $scope.enrollments[i] ];
									} else {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)]
												.push($scope.enrollments[i]);
									}
								}
							};

							$scope.range = function(start, end) {
								var ret = [];
								if (!end) {
									end = start;
									start = 0;
								}
								for (var i = start; i < end; i++) {
									ret.push(i);
								}
								return ret;
							};

							$scope.prevPage = function() {
								if ($scope.currentPage > 0) {
									$scope.currentPage--;
								}
							};

							$scope.nextPage = function() {
								if ($scope.currentPage < $scope.pagedItems.length - 1) {
									$scope.currentPage++;
								}
							};

							$scope.setPage = function() {
								$scope.currentPage = this.n;
							};
						} ]);

myAppControllers
		.controller(
				'SlideViewCtrl',
				[
						'$scope',
						'$routeParams',
						'$location',
						'$sce',
						'TrainingCourse',
						'UserService',
						'EnrollmentTestService',

						function($scope, $routeParams, $location, $sce,
								TrainingCourse, UserService,
								EnrollmentTestService) {

							var courseId = $routeParams.id;
							$scope.enrollmentId = $routeParams.enid;
							console.log("Enrollment id : "
									+ $scope.enrollmentId);
							$scope.courseId = courseId;
							$scope.slides = [];
							$scope.slide = {};
							$scope.course = {};
							$scope.current = 0;
							$scope.index = '';
							$scope.isbegin = true;
							$scope.isend = false;
							TrainingCourse.get({
								id : courseId
							},

							function(course, responseHeaders) {

								console.log("slide content : "
										+ course.slides.length);

								$scope.slides = course.slides;
								$scope.slide = $scope.slides[0];
								$scope.renderSlide($scope.slide);
								$scope.course = course;

								$scope.showhide();

							}, function(httpResponse) {
								console.log("slide content receive failed.: ");
							});

							$scope.renderSlide = function(slide) {
								var url = slide.url;
								var content = '<img border="0" src="'
										+ url
										+ '" alt="Slide" width="800" height="550">';
								$scope.myHTML = $sce.trustAsHtml(content);
							};

							$scope.prevslide = function() {
								if ($scope.current > 0) {
									$scope.current = $scope.current - 1;
									$scope.slide = $scope.slides[$scope.current];
									$scope.renderSlide($scope.slide);

								} else {
									console.log("Begining of slide show: "
											+ $scope.current);
								}
								$scope.showhide();
							};

							$scope.showhide = function() {
								if ($scope.current == 0) {
									$scope.isbegin = true;
								}

								if ($scope.current > 0) {
									$scope.isbegin = false;
								}

								if ($scope.current == $scope.slides.length - 1) {
									$scope.isend = true;
								}
								if ($scope.current < $scope.slides.length - 1) {
									$scope.isend = false;
								}
								$scope.index = ($scope.current + 1) + '/'
										+ $scope.slides.length;
							};
							$scope.nextslide = function() {
								if ($scope.current < $scope.slides.length) {
									$scope.current = $scope.current + 1;
									$scope.slide = $scope.slides[$scope.current];
									$scope.renderSlide($scope.slide);
								} else {
									console.log("End of slide show: "
											+ $scope.current);
								}
								$scope.showhide();
							};

							$scope.startExam = function() {
								console.log("Starting exam for with course id "
										+ $scope.courseId);
								var enrollmentTest = {
									enrollmentId : $scope.enrollmentId
								};
								EnrollmentTestService
										.save(
												{},
												enrollmentTest,
												function(u, responseHeaders) {
													console
															.log("Enrollment test created on server ...: "
																	+ u.result);
													$location
															.path('/course-exam/'
																	+ $scope.courseId
																	+ '/test/'
																	+ u.result);

												},
												function(httpResponse) {
													console
															.log("error creating enrollment test on the server  ");
												});

							};

						} ]);

myAppControllers
		.controller(
				'QuestionAnswerControllers',
				[
						'$scope',
						'$routeParams',
						'$location',
						'$sce',
						'TrainingCourse',
						'QuestionAnswer',
						'UserService',
						'EnrollmentTestService',

						function($scope, $routeParams, $location, $sce,
								TrainingCourse, QuestionAnswer, UserService,
								EnrollmentTestService) {

							var courseId = $routeParams.id;
							$scope.courseId = courseId;
							$scope.current = -1;
							$scope.testid = $routeParams.tid;
							$scope.exam_title = '';
							$scope.question = {};
							$scope.endOfExam = false;
							$scope.totalCorrect = 0;
							$scope.testSummary = "Course exam result summary:";
							$scope.passed = false;
							$scope.passMark = 80;
							$scope.wquestions = [];
							$scope.resetMessage();

							TrainingCourse.get({
								id : courseId
							},

							function(course) {
								$scope.exam_title = course.name;
								$scope.passMark = course.passMark;
							}, function(httpResponse) {
								console.log("error...");
							});

							$scope.questions = QuestionAnswer.query({
								id : courseId
							}, function(questions) {
								console.log("Questions loaded.. "
										+ questions.length);
								$scope.renderQuestion(0);
								$scope.current = 0;
								/*
								 * if ($scope.current < $scope.questions.length) {
								 * $scope.next = $scope.current + 1; }
								 */
							});

							$scope.back = function() {
								$location.path('/mycourses/'
										+ UserService.UserId);
							};

							$scope.finishExam = function() {
								$location.path('/completed/'
										+ UserService.UserId);
							};

							$scope.nextq = function() {

								// Validate if the user selected any anser
								if ($scope.question.userAnswer == null) {
									$scope.showMessage = true;
									$scope.message = 'Please select an answer';
									$scope.messageClass = 'alert-danger';
									return;
								}

								$scope.message = '';
								$scope.showMessage = false;
								$scope.messageClass = 'alert-success';

								// Process question before navigating to next
								// page;
								$scope.processQuestion($scope.question);

								if ($scope.current < $scope.questions.length - 1) {
									$scope.current = $scope.current + 1;
									$scope.question = $scope.questions[$scope.current];
									// console.log("Rendering question " +
									// $scope.question.name);
								} else {
									console.log("End of questions ");
									$scope.question = {};
									$scope.endOfExam = true;
									var percent = ($scope.totalCorrect * 100)
											/ $scope.questions.length;
									console.log("Percent " + percent
											+ " , min pass mark: "
											+ $scope.passMark);
									if (percent >= $scope.passMark) {
										$scope.passed = true;
									}
								}

							};

							$scope.processQuestion = function(question) {
								var userAns = parseInt(question.userAnswer);
								var isCorrect = false;
								var wanswer = '';
								angular
										.forEach(
												question.answers,
												function(ans) {

													if (ans.correct
															&& userAns == ans.id) {
														// console.log("User
														// answer correctly , "
														// + ans.answer);
														$scope.totalCorrect = $scope.totalCorrect + 1;
														isCorrect = true;
													}
													if (userAns == ans.id) {
														wanswer = ans.answer;
													}
												});

								if (isCorrect == false) {
									var wquestion = {
										name : question.name,
										ans : wanswer
									};
									$scope.wquestions.push(wquestion);
								}
								var eoft = false;
								if ($scope.current == $scope.questions.length - 1) {
									console.log("End of test encountered... ");
									eoft = true;
								}
								// Save state to the server
								var details = {
									questionId : question.id,
									userAnswerId : userAns,
									correct : isCorrect,
									endOfTest : eoft
								};
								EnrollmentTestService
										.save(
												{
													id : $scope.testid
												},
												details,
												function(u, responseHeaders) {
													console
															.log("Enrollment test created on server ...: "
																	+ u.result);

												},
												function(httpResponse) {
													console
															.log("error creating enrollment test on the server  ");
												});

							};

							$scope.renderQuestion = function(index) {

								$scope.question = $scope.questions[index];

								console.log("Rendering question "
										+ $scope.question.name);
							};

						} ]);

myAppControllers.controller('NavBarCtrl',
		[
				'$scope',
				'$location',
				'UserService',
				'Page',
				function($scope, $location, UserService, Page) {

					$scope.message = '';
					$scope.showMessage = false;
					$scope.messageClass = 'alert-success';

					$scope.Page = Page;

					$scope.isDisplayed = function(val) {

						var isAnonymous = _.isEqual(val, 'anon');
						var isUser = _.isEqual(val, 'user');
						var isAdmin = _.isEqual(val, 'admin');
						var isCommon = _.isEqual(val, 'common');
						// console.log( "Anon: "+isAnonymous + " "+val + ", "+
						// UserService.isLoggedIn());
						// Activate anonymous menu
						if (isAnonymous && !UserService.isLoggedIn()
								&& _.isEqual(UserService.getRole(), 'anon')) {
							return true;
						}

						// Activate user menu
						if (isUser && UserService.isLoggedIn()
								&& _.isEqual(UserService.getRole(), 'user')) {
							return true;
						}

						// Activate admin menu
						if (isAdmin && UserService.isLoggedIn()
								&& _.isEqual(UserService.getRole(), 'admin')) {
							return true;
						}

						if (isCommon && UserService.isLoggedIn()) {
							return true;
						}
						return false;
					};

					$scope.logout = function() {

						UserService.performLogout();
						UserService.Role = 'anon';

						$location.path('/login');

					};

					$scope.currentUserId = function() {
						return UserService.getUserId();
					};

					$scope.resetMessage = function() {
						$scope.message = '';
						$scope.showMessage = false;
						$scope.messageClass = 'alert-success';
					};

					function detectRoute() {

						var path = $location.path();
						var authRequired = true;
						_.each([ '/register', '/forgot-password' ],
								function(p) {

									if (path.match(new RegExp(p))) {
										authRequired = false;

									}
									console.log("--> " + p);
								});

						var authNotReq = $location.path().match(
								new RegExp('/register')) ? false : true;

						var authNotReq2 = $location.path().match(
								new RegExp('/forgot-password')) ? false : true;

						console.debug("Path ...." + path + " " + authNotReq2
								+ "..." + authNotReq + ", logged: "
								+ UserService.isLoggedIn());

						if (!UserService.isLoggedIn() && authRequired) {
							console.log("Redirecting to login ...." + path
									+ "..." + authNotReq);
							$location.path('/login');
						}
					}

					$scope.$on('$routeChangeSuccess', detectRoute);

				} ]);

myAppControllers
		.controller(
				'EnrollmentListControllers',
				[
						'$scope',
						'$filter',
						'$location',
						'CourseEnrollment',
						function($scope, $filter, $location, CourseEnrollment) {

							CourseEnrollment.query({}, function(enrollments) {
								console.log("Loaded all enrollments "
										+ enrollments.length);
								$scope.enrollments = enrollments;
								$scope.search();
							});

							$scope.orderProp = 'code';
							$scope.sortingOrder = 'code';
							$scope.reverse = false;
							$scope.filteredItems = [];
							$scope.groupedItems = [];
							$scope.itemsPerPage = 10;
							$scope.pagedItems = [];
							$scope.currentPage = 0;
							$scope.showPager = true;

							$scope.addCoursEnrollment = function() {
								$location.path('/add-enrollment');
							};
							$scope.deleteEnrollment = function(id) {
								CourseEnrollment.remove({
									id : id
								}, {}, function(u, responseHeaders) {
									console.log("Record deleted");
									CourseEnrollment.query({}, function(
											enrollments) {
										console.log("Reloaded all enrollment "
												+ enrollments.length);
										$scope.enrollments = enrollments;
										$scope.search();
									});
								}, function(httpResponse) {
									$scope.message = httpResponse.data.result;
									$scope.messageClass = 'alert-danger';
								});

							};
							// init the filtered items
							$scope.search = function() {
								$scope.showPager = true;
								if ($scope.enrollments.length <= $scope.itemsPerPage) {
									$scope.showPager = false;
								}
								$scope.currentPage = 0;
								// now group by pages
								$scope.groupToPages();
							};

							// calculate page in place
							$scope.groupToPages = function() {
								$scope.pagedItems = [];

								for (var i = 0; i < $scope.enrollments.length; i++) {
									if (i % $scope.itemsPerPage === 0) {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)] = [ $scope.enrollments[i] ];
									} else {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)]
												.push($scope.enrollments[i]);
									}
								}
							};

							$scope.range = function(start, end) {
								var ret = [];
								if (!end) {
									end = start;
									start = 0;
								}
								for (var i = start; i < end; i++) {
									ret.push(i);
								}
								return ret;
							};

							$scope.prevPage = function() {
								if ($scope.currentPage > 0) {
									$scope.currentPage--;
								}
							};

							$scope.nextPage = function() {
								if ($scope.currentPage < $scope.pagedItems.length - 1) {
									$scope.currentPage++;
								}
							};

							$scope.setPage = function() {
								$scope.currentPage = this.n;
							};

						} ]);
myAppControllers
		.controller(
				'CourseListControllers',
				[
						'$scope',
						'$filter',
						'$location',
						'TrainingCourse',
						function($scope, $filter, $location, TrainingCourse) {

							TrainingCourse.query({}, function(courses) {
								console.log("Loaded all courses "
										+ courses.length);
								$scope.courses = courses;
								$scope.search();
							});
							$scope.showPager = true;
							$scope.orderProp = 'code';
							$scope.sortingOrder = 'code';
							$scope.reverse = false;
							$scope.filteredItems = [];
							$scope.groupedItems = [];
							$scope.itemsPerPage = 10;
							$scope.pagedItems = [];
							$scope.currentPage = 0;

							$scope.addCourse = function() {
								$location.path('/course-details');
							};

							$scope.deleteCourse = function(id) {
								TrainingCourse
										.remove(
												{
													id : id
												},
												{},

												function(u, responseHeaders) {

													$scope.message = "Record successfully deleted";
													$scope.messageClass = 'alert-success';

													/** Re-populate the model */

													TrainingCourse
															.query(
																	{},
																	function(
																			courses) {
																		console
																				.log("Reloading content... "
																						+ courses.length);
																		$scope.courses = courses;
																		$scope
																				.search();
																	});

												},
												function(httpResponse) {
													$scope.message = httpResponse.data.result;
													$scope.messageClass = 'alert-danger';
												});
							};

							// init the filtered items
							$scope.search = function() {
								$scope.showPager = true;
								if ($scope.courses.length <= $scope.itemsPerPage) {
									$scope.showPager = false;
								}

								$scope.currentPage = 0;
								// now group by pages
								$scope.groupToPages();
							};

							// calculate page in place
							$scope.groupToPages = function() {
								$scope.pagedItems = [];

								for (var i = 0; i < $scope.courses.length; i++) {
									if (i % $scope.itemsPerPage === 0) {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)] = [ $scope.courses[i] ];
									} else {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)]
												.push($scope.courses[i]);
									}
								}
							};

							$scope.range = function(start, end) {
								var ret = [];
								if (!end) {
									end = start;
									start = 0;
								}
								for (var i = start; i < end; i++) {
									ret.push(i);
								}
								return ret;
							};

							$scope.prevPage = function() {
								if ($scope.currentPage > 0) {
									$scope.currentPage--;
								}
							};

							$scope.nextPage = function() {
								if ($scope.currentPage < $scope.pagedItems.length - 1) {
									$scope.currentPage++;
								}
							};

							$scope.setPage = function() {
								$scope.currentPage = this.n;
							};

						} ]);

myAppControllers.controller('CourseDetailsController', [ '$scope',
		'$routeParams', '$location', 'TrainingCourse',
		function($scope, $routeParams, $location, TrainingCourse) {

			var param1 = $routeParams.param1;
			$scope.courseAction = 0;
			$scope.message = '';
			$scope.showMessage = false;
			$scope.messageClass = 'alert-success';
			// $scope.course = {};

			if (param1 != null && param1 != 'undefined') {
				console.log("Load course with course id " + param1);
				$scope.courseAction = 1;
				$scope.course = TrainingCourse.get({
					id : param1
				});
			}

			$scope.save = function(course) {
				$scope.showMessage = true;
				/** Create */
				if ($scope.courseAction == 0) {

					TrainingCourse.save({}, course,

					function(u, responseHeaders) {
						$scope.message = "Record successfully created";
						$scope.messageClass = 'alert-success';

					}, function(httpResponse) {
						$scope.message = httpResponse.data.result;
						$scope.messageClass = 'alert-danger';
					});

				}
				/** Update */
				else if ($scope.courseAction == 1) {

					TrainingCourse.save({
						id : course.id
					}, course,

					function(u, responseHeaders) {

						$scope.message = "Record successfully updated";
						$scope.messageClass = 'alert-success';
						// $scope.course = course;

					}, function(httpResponse) {
						$scope.message = httpResponse.data.result;
						$scope.messageClass = 'alert-danger';
					});

				}
			};

			$scope.back = function() {
				$location.path('/course-list');
			};

		} ]);

myAppControllers.controller('UserCourseCtrl', [
		'$scope',
		'$routeParams',
		'$location',
		'$filter',
		'CourseAssignment',
		'TrainingCourse',
		function($scope, $routeParams, $location, $filter, CourseAssignment,
				TrainingCourse) {

			var csId = $routeParams.id;
			$scope.message = 'Please wait...';
			$scope.showMessage = false;
			$scope.messageClass = 'alert-success';

			$scope.courseUsers = CourseAssignment.query({
				id : csId
			});
			$scope.course = TrainingCourse.get({
				id : csId
			});

			$scope.back = function() {
				$location.path('/course-list');
			};

			$scope.saveCourseAssignment = function(usrcourses) {

				$scope.showMessage = true;
				var _courseUsers = {
					courseId : csId,
					users : usrcourses
				};

				CourseAssignment.save({
					id : csId
				}, _courseUsers,

				function(responseHeaders) {

					$scope.message = "Record successfully updated";
					$scope.messageClass = 'alert-success';

				},

				function(httpResponse) {
					$scope.message = httpResponse.data.result;
					$scope.messageClass = 'alert-danger';
				});

			};

		} ]);

myAppControllers
		.controller(
				'UserCourseEnrollmentCtrl',
				[
						'$scope',
						'$routeParams',
						'$location',
						'TrainingCourse',
						'Page',
						'CourseAssignment',
						'CourseEnrollment',
						'Employees',
						function($scope, $routeParams, $location,
								TrainingCourse, Page, CourseAssignment,
								CourseEnrollment, Employees) {

							var param1 = $routeParams.id;
							$scope.courseAction = 0;
							$scope.message = '';
							$scope.showMessage = false;
							$scope.messageClass = 'alert-success';
							$scope.courses = [];
							$scope.enrollment = {};
							$scope.users = [];
							$scope.enrollment.users = [];
							Page.setTitle('User course enrollment');

							TrainingCourse.query({}, function(courses) {
								$scope.courses = courses;
							});

							Employees.query({
								type : 'user'
							}, function(users) {
								$scope.users = users;
							});

							if (param1 != null && param1 != 'undefined') {
								// console.log("Loading enrollment with id " +
								// param1);
								$scope.courseAction = 1;

								CourseEnrollment
										.get(
												{
													id : param1
												},
												function(enrollment) {
													// console.log("Loaded
													// enrollment with id " +
													// param1);
													$scope.enrollment = enrollment;
													$scope.enrollment.courseId = enrollment.courseId;
												});
							}

							$scope.saveCourseEnrollment = function(enrollment) {
								$scope.showMessage = true;
								$scope.message = "Please wait...";
								/** Create */
								if ($scope.courseAction == 0) {
									CourseEnrollment
											.save(
													{},
													enrollment,
													function(en,
															responseHeaders) {
														$scope.message = "Course enrollment added successfully";
														$scope.messageClass = 'alert-success';
														console
																.log("Updated....."
																		+ en);
														// /$scope.enrollment.id
														// = en.result;
														// $scope.courseAction =
														// 1;
														$location
																.path('/enrollment-list');
													},
													function(httpResponse) {
														$scope.message = httpResponse.data.result;
														$scope.messageClass = 'alert-danger';
													});
								}
								/** Update */
								else if ($scope.courseAction == 1) {

									CourseEnrollment
											.save(
													{
														id : $scope.enrollment.id
													},
													enrollment,

													function(responseHeaders) {
														$scope.message = "Course enrollment successfully updated";
														$scope.messageClass = 'alert-success';
													},

													function(httpResponse) {
														$scope.message = httpResponse.data.result;
														$scope.messageClass = 'alert-danger';
													});
								}
							};

							$scope.addToEnrollment = function(user) {
								console.log(user);
								var userCourseEnrollment = {
									userId : user.id,
									userName : user.name,
									userEmail : user.email,
									status : 'PENDING'
								};
								if ($scope.enrollment.users == null) {
									$scope.enrollment.users = [];
								}
								$scope.enrollment.users
										.push(userCourseEnrollment);
								CourseEnrollment.save({
									id : $routeParams.id
								}, $scope.enrollment,

								function(responseHeaders) {
									console.log("Updated.....");

									$scope.enrollment = CourseEnrollment.get({
										id : $routeParams.id
									});

								},

								function(httpResponse) {
									console.log("Error...");
								});
								$('#myModal').modal('hide');

							};

							$scope.back = function() {
								$location.path('/enrollment-list');
							};

						} ]);

myAppControllers.controller('ChangePasswordControllers', [
		'$scope',
		'$routeParams',
		'$location',
		'ChangePassword',
		'Page',
		'UserService',
		function($scope, $routeParams, $location, ChangePassword, Page,
				UserService) {

			Page.setTitle('Change password');
			$scope.message = '';
			$scope.showMessage = false;
			$scope.messageClass = 'alert-success';
			var userId = $routeParams.id;
			console.debug("Changing user password for the id: " + userId);
			$scope.user = {
				oldPassword : '',
				newPassword : '',
				id : UserService.getUserId()
			};
			$scope.changepass = function(user) {
				$scope.showMessage = true;
				$scope.message = "Please wait...";
				ChangePassword.change({
					id : $routeParams.id
				}, user,

				function(responseHeaders) {
					$scope.message = "Password successfully changed";
					$scope.messageClass = 'alert-success';
				},

				function(httpResponse) {
					$scope.message = httpResponse.data.result;
					$scope.messageClass = 'alert-danger';
				});
			};

		} ]);

myAppControllers
		.controller(
				'ForgotPasswordControllers',
				[
						'$scope',
						'$routeParams',
						'$location',
						'LostPassword',
						'Page',
						function($scope, $routeParams, $location, LostPassword,
								Page) {

							Page.setTitle('Get new password');
							$scope.message = '';
							$scope.showMessage = false;
							$scope.messageClass = 'alert-success';
							// $scope.basePath = Page.rootURL();

							console.debug("forgot  user password for the id: ");

							$scope.user = {
								email : ''
							};

							$scope.sendpass = function(user) {
								$scope.showMessage = true;
								$scope.message = "Please wait...";
								LostPassword
										.lostpass(
												{},
												user,
												function(responseHeaders) {
													$scope.message = "A temporary password has been sent to your email address";
													$scope.messageClass = 'alert-success';
												},

												function(httpResponse) {
													$scope.message = httpResponse.data.result;
													$scope.messageClass = 'alert-danger';
												});
							};

						} ]);

myAppControllers
		.controller(
				'EmployeeListControllers',['$scope',
						'$filter',
						'$location',
						'Employees','Page',
						function($scope, $filter, $location, Employees,Page) {

							Page.setTitle("Employee list management");
							Employees.query({
								type : 'user'
							}, function(employees) {

								console.log("Loaded all courses "
										+ employees.length);

								$scope.employees = employees;
								$scope.search();
							});

							$scope.showPager = true;
							$scope.orderProp = 'firstName';
							$scope.sortingOrder = 'firstName';
							$scope.reverse = false;
							$scope.filteredItems = [];
							$scope.groupedItems = [];
							$scope.itemsPerPage = 10;
							$scope.pagedItems = [];
							$scope.currentPage = 0;

							$scope.addEmployee = function() {
								$location.path('/employee-details');
							};

							$scope.deleteEmployee = function(id) {
								Employees.remove({id : id},{},
									function(u, responseHeaders) {
										Employees.query({
											type : 'user'
										},
										function(employees) {
	
											console.log("Loaded all courses "
													+ employees.length);
	
											$scope.employees = employees;
											$scope.search();
										});

									},
									function(httpResponse) {

									});
							};	

							// init the filtered items
							$scope.search = function() {
								$scope.showPager = true;
								if ($scope.employees.length <= $scope.itemsPerPage) {
									$scope.showPager = false;
								}

								$scope.currentPage = 0;
								// now group by pages
								$scope.groupToPages();
							};

							// calculate page in place
							$scope.groupToPages = function() {
								$scope.pagedItems = [];

								for (var i = 0; i < $scope.employees.length; i++) {
									if (i % $scope.itemsPerPage === 0) {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)] = [ $scope.employees[i] ];
									} else {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)]
												.push($scope.employees[i]);
									}
								}
							};

							$scope.range = function(start, end) {
								var ret = [];
								if (!end) {
									end = start;
									start = 0;
								}
								for (var i = start; i < end; i++) {
									ret.push(i);
								}
								return ret;
							};

							$scope.prevPage = function() {
								if ($scope.currentPage > 0) {
									$scope.currentPage--;
								}
							};

							$scope.nextPage = function() {
								if ($scope.currentPage < $scope.pagedItems.length - 1) {
									$scope.currentPage++;
								}
							};

							$scope.setPage = function() {
								$scope.currentPage = this.n;
							};

						} ]);

myAppControllers.controller('EmployeeDetailsController', [ '$scope',
		'$routeParams', '$location', 'Employees','Page',
		function($scope, $routeParams, $location, Employees, Page) {

			Page.setTitle("Employee details");
			var param1 = $routeParams.id;
			$scope.action = 0;
			$scope.message = '';
			$scope.showMessage = false;
			$scope.messageClass = 'alert-success';
			// $scope.course = {};

			if (param1 != null && param1 != 'undefined') {
				console.log("Load Employee with id " + param1);
				$scope.action = 1;
				$scope.employee = Employees.get({
					id : param1 , type: 'user'
				});
			}

			$scope.save = function(employee) {
				$scope.showMessage = true;
				/** Create */
				if ($scope.action == 0) {

					Employees.save({}, employee,

					function(u, responseHeaders) {
						$scope.message = "Record successfully created";
						$scope.messageClass = 'alert-success';

					}, function(httpResponse) {
						$scope.message = httpResponse.data.result;
						$scope.messageClass = 'alert-danger';
					});

				}
				/** Update */
				else if ($scope.action == 1) {

					Employees.save({
						id : $routeParams.id
					}, employee,

					function(u, responseHeaders) {

						$scope.message = "Record successfully updated";
						$scope.messageClass = 'alert-success';
						// $scope.course = course;

					}, function(httpResponse) {
						$scope.message = httpResponse.data.result;
						$scope.messageClass = 'alert-danger';
					});

				}
			};

			$scope.back2 = function() {
				$location.path('/employee-list');
			};
					

		} ]);