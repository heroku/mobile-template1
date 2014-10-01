angular.module('admin', ['starter.services','ngResource'])

.controller('AdminCtrl', function($window, $scope, SocketIO, Question, Answer, SocketIO) {
	$scope.question = {};
	$scope.current_question = {};
	$scope.questions = Question.query(function(result) {
		console.log(result);
	});
	$scope.answers = [];

	$scope.leaders = Answer.leaders(function(result) {
		console.log(result);
	});

	$scope.saveQuestion = function() {
		$scope.question.answers = JSON.stringify($scope.question.answers.split(","));
		new Question($scope.question).$save(function() {
			$scope.questions = Question.query();
		});
	}

	$scope.activate = function(question_id) {
		var cbs = document.getElementsByClassName('cb');
		for (var i = 0; i < cbs.length; i++) {
			if (cbs[i].attributes['ng-data-id'].value != (''+question_id)) {
				cbs[i].checked = false;
			}
		}
		new Question({questionId:question_id}).$activate({questionId:question_id});
	}

	$scope.next_question = function() {
		$scope.answers = [];
		new Question({questionId:0}).$next({questionId:0});
	}

	$scope.clearLeaders = function() {
		Answer.truncate(function() {
			$scope.leaders = Answer.leaders();
		});
	}

	SocketIO.on('questions', function(msg){
		$scope.current_question = JSON.parse(msg);
		$scope.$apply();
	});

	SocketIO.on('answer', function(msg) {
		$scope.leaders = Answer.leaders();
	});

	SocketIO.on('_every_answer', function(msg) {
		var a = JSON.parse(msg);
		console.log(a);
		$scope.answers.push(a);
		$scope.leaders = Answer.leaders();
		$scope.$apply();
	});

})

.config(function($httpProvider) {
	$httpProvider.interceptors.push('TokenInterceptor');
})

