angular.module('admin', ['starter.services', 'ngResource'])
.controller('AdminBootCtrl', function($window, $location, $http) {
  $http({method:'GET', url: '/admin'}).success(function(data, status, headers) {
    window.location = headers('Location');
    console.log(headers('Location'));
  });
})

.controller('AdminCtrl', function($window, $scope, SocketIO, Question, Answer, SocketIO) {
  // question creation
  resetCreateForm();

  $scope.addAnswer = function() {
    $scope.questionAnswers.push({});
  };

  $scope.saveQuestion = function() {
    $scope.questionErrors.question = validCreateQuestion();
    $scope.questionErrors.answers = validCreateAnswers();

    if ($scope.questionErrors.question && $scope.questionErrors.answers) {
      var answers = [];
      $scope.questionAnswers.forEach(function(answer, index) {
        if (answer.text && answer.text.trim().length) {
          answers.push(answer.text.trim());
          if (index === $scope.question.answer_index) $scope.question.answer_index = answers.length - 1;
        }
      });
      $scope.question.answers = JSON.stringify(answers);
      new Question($scope.question).$save(function() {
        $scope.questions = Question.query();
      });
      resetCreateForm();
    }
  };

  function resetCreateForm() {
    $scope.questionErrors = {
      question: true,
      answers: true
    };
    $scope.question = {};
    $scope.question.answer_index = 0;
    $scope.questionAnswers = [{}];
  }

  function validCreateQuestion() {
    return $scope.question.question && $scope.question.question.trim().length;
  }

  function validCreateAnswers() {
    return $scope.questionAnswers.filter(function(answer, index) {
      return answer.text && answer.text.trim().length && $scope.question.answer_index === index;
    }).length > 0;
  }

  // current question
  $scope.currentQuestion = {};
  $scope.questions = Question.query(function(result) {
    console.log(result);
  });
  $scope.answers = [];

  $scope.nextQuestion = function() {
    $scope.answers = [];
    new Question({
      questionId: 0
    }).$next({
      questionId: 0
    });
  }

  // leaderboard
  $scope.leaders = Answer.leaders(function(result) {
    console.log(result);
  });

  $scope.clearLeaders = function() {
    Answer.truncate(function() {
      $scope.leaders = Answer.leaders();
    });
  }

  // sockets
  SocketIO.on('questions', function(msg) {
    $scope.currentQuestion = JSON.parse(msg);
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