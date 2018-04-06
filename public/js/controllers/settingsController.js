require('angular');

angular.module('ETPApp').controller('settingsController', ['$scope', '$rootScope', '$http', "userService", "$interval", "multisignatureModal", 'gettextCatalog', '$location', function ($rootScope, $scope, $http, userService, $interval, multisignatureModal, gettextCatalog, $location) {

    var setPage = function () {
        $scope.view.page = {title: gettextCatalog.getString('Settings'), previous: null};
    }

    // Refresh $scope.view.page object on change of language.
    $rootScope.$on('gettextLanguageChanged', setPage);
    // Set $scope.view.page at runtime.
    setPage();

    $scope.view.bar = {};

    $scope.settings = {
        user: userService,
        enabledMultisign: false
    }

    // Enable/Disable multisignature settings
    $scope.multisignaturesEnabled = false;

    $scope.checkEnabledMultisign = function () {
        if (!_.isEmpty(userService.u_multisignatures)) {
            return true;
        } else if (!_.isEmpty(userService.multisignatures)) {
            return true;
        } else {
            return false;
        }
    }

    $scope.settings.enabledMultisign = $scope.checkEnabledMultisign();

    $scope.updateSettings = $interval(function () {
        $scope.settings.enabledMultisign = $scope.checkEnabledMultisign();
    }, 1000);

    $scope.setMultisignature = function () {
        if ($scope.checkEnabledMultisign()) {
            return;
        } else {
            $scope.settings.enabledMultisign = true;
        }
        $interval.cancel($scope.updateSettings);
        $scope.multisignatureModal = multisignatureModal.activate({
            destroy: function (enabled) {
                $scope.settings.enabledMultisign = enabled;
                $scope.settings.updateSettings = $interval(function () {
                    $scope.enabledMultisign = $scope.checkEnabledMultisign();
                }, 1000);
            }
        });
    }

















    $scope.steps = [
        'Step 1: Download App',
        'Step 2: Scan QR Code',
        'Step 3: Backup Key',
        'Step 4: Enable Google Authentication'
      ];
      $scope.selection = $scope.steps[0];
    
      $scope.getCurrentStepIndex = function(){
        // Get the index of the current step given selection
        return _.indexOf($scope.steps, $scope.selection);
      };
    
      // Go to a defined step index
      $scope.goToStep = function(index) {
        if ( !_.isUndefined($scope.steps[index]) )
        {
          $scope.selection = $scope.steps[index];
        }
      };
    
      $scope.hasNextStep = function(){
        var stepIndex = $scope.getCurrentStepIndex();
        var nextStep = stepIndex + 1;
        // Return true if there is a next step, false if not
        return !_.isUndefined($scope.steps[nextStep]);
      };
    
      $scope.hasPreviousStep = function(){
        var stepIndex = $scope.getCurrentStepIndex();
        var previousStep = stepIndex - 1;
        // Return true if there is a next step, false if not
        return !_.isUndefined($scope.steps[previousStep]);
      };
    
      $scope.incrementStep = function() {
        if ( $scope.hasNextStep() )
        {
          var stepIndex = $scope.getCurrentStepIndex();
          var nextStep = stepIndex + 1;
          $scope.selection = $scope.steps[nextStep];
        }
      };
    
      $scope.decrementStep = function() {
        if ( $scope.hasPreviousStep() )
        {
          var stepIndex = $scope.getCurrentStepIndex();
          var previousStep = stepIndex - 1;
          $scope.selection = $scope.steps[previousStep];
        }
      };



    
    
    
   

}]);











