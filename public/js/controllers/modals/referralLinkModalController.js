require('angular');
var config = require('../../../../config');

angular.module('DDKApp').controller("referralLinkModalController", ["$scope","$rootScope","referralLinkModal", "userService","$http", function ($scope,$rootScope,referralLinkModal,userService,$http) {

    $scope.close = function () {
        referralLinkModal.deactivate();
        angular.element(document.querySelector("body")).removeClass("ovh");
    }

    $scope.generateReferLink = function(){
        
        let userAddress = userService.getAddress();

        if(!userAddress) {
            $scope.noMatch = true;
            $scope.errorMessage = "Currently not able to generate the referral link";
            return;
        }
        
        $scope.refLink = config.domainName + '/referal/' + userAddress;

  /*      $http.post($rootScope.serverUrl + "/referral/generateReferalLink/", { secret: userAddress }).then(function (resp) {
            if (resp.data.success) {
                $scope.refLink = config.domainName + '/referal/' + resp.data.referralLink;
            } else {
                $scope.noMatch = true;
                $scope.errorMessage = resp.data.error ? resp.data.error : 'Error connecting to server';
            }
        }, function (error) {
            $scope.noMatch = true;
            $scope.errorMessage = error.data.error ? error.data.error : error.data;
        });   */

    }

    $scope.sendEmail = function(email,refLink)
    {
        $scope.noMatch = false;

        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        
        if(!refLink) {
            $scope.errorMessage = "Mail can't be sent with blank refer link";
            $scope.noMatch = true;
            return;
        }

        if (email == undefined || email == '') {
            $scope.errorMessage = 'Email is required';
            $scope.noMatch = true;
            return;
        }

        if(!regex.test(email))
        {
            $scope.errorMessage = 'Please enter a valid email address.';
            $scope.noMatch = true;
            return;
        }

        if(email.length < 6 || email.length > 50) {
            $scope.errorMessage = 'Email length must be between 6 to 50 characters.';
            $scope.noMatch = true;
            return;
        }

        $http.post($rootScope.serverUrl + "/referral/sendEmail/", { referlink: refLink, email:email }).then(function (resp) {
            if (resp.data.success) {
                Materialize.toast(resp.data.info, 3000, 'green white-text');
                referralLinkModal.deactivate();
            } else {
                $scope.errorMessage = resp.data.error ? resp.data.error : 'Error connecting to server';
            }
        }, function (error) {
            $scope.errorMessage = error.data.error ? error.data.error : error.data;
        });
    }

    $scope.generateReferLink();

}]);
