(function(undefined) {

  module.exports = function(app) {

    app.controller('MainCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      '$timeout',
      'Vindig',
      function($rootScope, $scope, $state, $timeout, Vindig) {
        // $scope.initialized = true;
        $scope.home = function() {
          if($state.current.name == 'home')
            $scope.initialized = false;
        };
        $scope.init = function() {
          $scope.initialized = true;
        };

        $scope.isDossier = false;

        $rootScope.$on('$stateChangeSuccess', function(ev, toState) {
          if(toState.name !== 'home')
            $scope.initialized = true;

          if(toState.name == 'home.dossier')
            $scope.isDossier = true;
          else
            $scope.isDossier = false;
        });

        $scope.$watch('isDossier', function(isDossier, prev) {
          $timeout(function() {
            $rootScope.$broadcast('invalidateMap');
          }, 400);
        });

        // Async get cases
        Vindig.cases().then(function(data) {
          $scope.casos = data.data;
          var totalPages = data.headers('X-WP-TotalPages');
          for(var i = 2; i <= totalPages; i++) {
            Vindig.cases({page: i}).then(function(data) {
              $scope.casos = $scope.casos.concat(data.data);
            });
          }
        });
      }
    ]);

    app.controller('HomeCtrl', [
      '$scope',
      'Dossiers',
      'Map',
      function($scope, Dossiers, Map) {

        $scope.$on('$stateChangeSuccess', function(ev, toState) {
          if(toState.name == 'home') {
            $scope.mapData = Map;
          }
        })

        $scope.$on('dossierMap', function(ev, map) {
          $scope.mapData = map;
        });

        $scope.dossiers = Dossiers.data;
      }
    ]);

    app.controller('DossierCtrl', [
      '$scope',
      '$sce',
      'Dossier',
      'DossierMap',
      function($scope, $sce, Dossier, Map) {
        $scope.dossier = Dossier.data;
        $scope.dossier.content = $sce.trustAsHtml($scope.dossier.content);
        $scope.$emit('dossierMap', Map);
      }
    ])

  };

})();
