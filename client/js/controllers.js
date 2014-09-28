angular.module('starter.controllers', [])

.controller('QuizCtrl', function($scope, SocketIO, Question) {
	$scope.q = {question:"...waiting for next question..."};
	$scope.q.answers = ['one','two','three'];
	$scope.answer = null;

	Question.query({show:true}, function(rows) {
		console.log("Questions returned ", rows);
		$scope.q = rows[0];
	});

	SocketIO.on('questions', function(msg){
		$scope.q = JSON.parse(msg);
		console.log($scope.questions);
		$scope.$apply();
	});

	$scope.saveChoice = function(index) {
		$scope.answer = $scope.q.answers[index];
		$scope.q.answers = [];
	}
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
});

