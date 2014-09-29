angular.module('starter.controllers', [])

.controller('QuizCtrl', function($scope, SocketIO, Question, Answer) {
	$scope.q = {question:"...waiting for next question..."};
	$scope.q.answers = ['one','two','three'];
	$scope.answer = null;

	Question.query({show:true, select:['question','answers']}, function(rows) {
		console.log("Questions returned ", rows);
		$scope.q = rows[0];
	});

	SocketIO.on('questions', function(msg){
		$scope.q = JSON.parse(msg);
		console.log($scope.questions);
		$scope.$apply();
	});

	$scope.saveChoice = function(index) {
		$scope.answer_color = 'button-stable';
		$scope.answer = $scope.q.answers[index];
		$scope.q.answers = [];
		var a = new Answer({question_id: $scope.q.id, user_id: '1', answer_index: index+1});
		a.$save(function() {
			// Right answer
			$scope.answer_color = 'button-balanced';
		}, function() {
			// Wrong answer
			$scope.answer_color = 'button-assertive';
		});
	}
})

.controller('RegisterCtrl', function($scope, $location, RegistrationService) {
	$scope.user = {name:'scooter', email:'foobar'};

	$scope.register = function() {
		RegistrationService.register($scope.user).then(function() {
			$location.path("/");
		})
	}
})
