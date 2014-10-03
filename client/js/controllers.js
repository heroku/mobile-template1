angular.module('starter.controllers', [])

.controller('QuizCtrl', function($scope, $ionicPopup, $ionicLoading, SocketIO, Question, Answer, RegistrationService) {
	$scope.q = {question:"...waiting for next question..."};
	$scope.q.answers = ['one','two','three'];
	$scope.answer = null;
	$scope.show_leaders = false;
	$scope.secondsLeft = 10;
	$scope.correct_answer = null;

	Question.query({show:true, select:['question','answers']}, function(rows) {
		console.log("Questions returned ", rows);
		$scope.q = rows[0];
		check_start();
	});

	function check_start() {
		if ($scope.q.question == 'start') {
			$scope.q.answers = [];
		} else if ($scope.q.question == 'end') {
			showLeaders();
		}
	}

	SocketIO.on('questions', function(msg){
		$scope.correct_answer = null;
		msg = JSON.parse(msg);

		if (msg.question != 'end') {
			$scope.timer = 3;
			$ionicLoading.show({template: 'Next question in 3 seconds...'});
		} else {
			showLeaders();
			$scope.timer = 1;
		}

		var timer = setInterval(function() {
			$scope.timer--;
	   		$ionicLoading.show({template: 'Next question in ' + $scope.timer + ' seconds...'});

			if ($scope.timer <= 0) {
				if (msg.question != 'end') {
					hideLeaders();
				}
				$ionicLoading.hide();
				clearInterval(timer);
				$scope.q = msg;
				$scope.answer = null;
				check_start();
				console.log($scope.q);
 				$scope.$apply();
			} 
		}, 1000);
	});

	SocketIO.on('answer', function(msg) {
		console.log("Answer ws ", msg);
		var packet = JSON.parse(msg);
		$scope.correct_answer = packet;
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
			$scope.answer_icon = 'ion-checkmark';
			showLeaders();
		}, function() {
			// Wrong answer
			$scope.answer_color = 'button-assertive';
			$scope.answer_icon = 'ion-close-round';
			showLeaders();
		});
	}

	function showLeaders() {
		$scope.show_leaders = true;
		$scope.leaders = Answer.leaders();
	}

	function hideLeaders() {
		$scope.show_leaders = false;
	}
})

.controller('RegisterCtrl', function($scope, $location, RegistrationService) {
	$scope.user = {name:'', email:'', password:'', password2: ''};

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

.controller('HomeCtrl', function($scope, $location) {

})
