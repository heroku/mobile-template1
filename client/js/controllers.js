angular.module('starter.controllers', [])

.controller('QuizCtrl', function($scope, $ionicPopup, SocketIO, Question, Answer, RegistrationService) {
	$scope.q = {question:"...waiting for next question..."};
	$scope.q.answers = ['one','two','three'];
	$scope.answer = null;
	$scope.is_answered = false;

	Question.query({show:true, select:['question','answers']}, function(rows) {
		console.log("Questions returned ", rows);
		$scope.q = rows[0];
	});

	SocketIO.on('questions', function(msg){
		$scope.q = JSON.parse(msg);
		$scope.answer = null;
		console.log($scope.q);
		$scope.$apply();
	});

	SocketIO.on('answer', function(msg) {
		console.log("Answer ws ", msg);
		var packet = JSON.parse(msg);
		var popup = $ionicPopup.alert({title: 'Answer', content: packet.user.name + " answered first!"});
		setTimeout(function() {
			popup.close();
		}, 3000);
	});

	$scope.$on('$destroy', function (event) {
        SocketIO.removeAllListeners('questions');
        SocketIO.removeAllListeners('answer');
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
	$scope.user = {name:'', email:''};

	$scope.register = function() {
		RegistrationService.register($scope.user).then(function() {
			$location.path("/");
		})
	}
})

.controller('LeadersCtrl', function($scope, SocketIO, Answer) {
	$scope.leaders = Answer.leaders();

	SocketIO.on('answer', function(msg) {
		$scope.leaders = Answer.leaders();
	});

	$scope.$on('$destroy', function (event) {
        SocketIO.removeAllListeners('answer');
    });

})
