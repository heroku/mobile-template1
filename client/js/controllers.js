angular.module('starter.controllers', [])

.controller('MyTodosCtrl', function($scope, SocketIO) {
	$scope.questions = [{question:"Are you experienced man?"}];
	SocketIO.on('questions', function(msg){
		$scope.questions.push(JSON.parse(msg));
		console.log($scope.questions);
		$scope.$apply();
	});
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
