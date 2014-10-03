angular.module('starter.services', [])

.factory('SocketIO', function() {
  return io()
})

.factory('Question', function($resource) {
  return $resource('/resource/questions/:questionId', null, {
    'activate': {method:'POST', url: '/resource/questions/:questionId/activate'},
    'next': {method:'POST', url: '/resource/questions/:questionId/next'}
  });
})

.factory('Answer', function($resource) {
  return $resource('/resource/answers/:answerId', null, {
    'leaders': {method:'GET', url:'/resource/leaders', isArray:true},
    'truncate': {method:'DELETE', url:'/resource/leaders'}
  });
})

.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    }

    return auth;
})

.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.localStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.localStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.localStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/admin/login");
            }

            return $q.reject(rejection);
        }
    };
})

.factory('RegistrationService', function ($window, $http, AuthenticationService) {
    return {
        login: function(username, password) {
            return $http.post('/login', {username: username, password: password});
        },

        logout: function() {
            delete $window.localStorage.token;
        },

        register: function(user) {
            return $http.post('/register', user).then(function(result) {
                AuthenticationService.isAuthenticated = true;
                $window.localStorage.token = result.data.token;
                console.log(result.data);
            });
        }
    }
})

.factory('UserResponse', function() {
    var storageKey = 'userResponses';
    
    var localGet = function(){
        var ret = localStorage.getItem(storageKey);
        if (ret === null) {
            ret = {};
        }
        else {
            ret = JSON.parse(ret);
        }
        return ret;
    };

    var localSet = function(val){
        localStorage.setItem(storageKey, JSON.stringify(val));
    };

    return {
        set: function(key, value){
            var answers = localGet();
            answers[key] = value;
            localSet(answers);
        },

        get: function(key){
            var answers = localGet();
            return answers[key];
        },

        reset: function(){
            localStorage.removeItem(storageKey);
        }
    };
})
