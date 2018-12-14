
require('angular');
var config = require('../../../config');

angular.module('DDKApp').controller('accountController', ['$state', '$scope', '$rootScope', 'referralLinkModal', '$http', "userService", "$interval", "$timeout", "sendTransactionModal", "secondPassphraseModal", "delegateService", 'viewFactory', 'transactionInfo', 'userInfo', '$filter', 'gettextCatalog', 'blockInfo', 'SpecifictransactionInfoModal',function ($state, $rootScope, $scope, referralLinkModal, $http, userService, $interval, $timeout, sendTransactionModal, secondPassphraseModal, delegateService, viewFactory, transactionInfo, userInfo, $filter, gettextCatalog, blockInfo, SpecifictransactionInfoModal) {
    
    $scope.ExplorerHost = config.explorerServerHost;
    $scope.ExplorerPort = config.explorerServerPort;
    $scope.view = viewFactory;
    $scope.view.inLoading = true;
    $scope.view.loadingText = gettextCatalog.getString('Loading dashboard');
    $scope.view.page = { title: gettextCatalog.getString('Dashboard'), previous: null };
    $scope.view.bar = {};
    $scope.delegate = undefined;
    $scope.address = userService.address;
    $scope.publicKey = userService.publicKey;
    $scope.balance = userService.balance;
    $scope.unconfirmedBalance = userService.unconfirmedBalance;
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.unconfirmedPassphrase = userService.unconfirmedPassphrase;
    $scope.transactionsLoading = true;
    $scope.sponsor ;
    $scope.allVotes = 100 * 1000 * 1000 * 1000 * 1000 * 100;
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    
    $scope.voteTransaction = false;
    $scope.stakeTransaction = false;

    $scope.graphs = {
        DDKPrice: {
            labels: ['1', '2'],
            series: ['Series B'],
            data: [
                [60, 20]
            ],
            colours: ['#29b6f6'],
            options: {
                scaleShowGridLines: false,
                pointDot: false,
                showTooltips: false,
                scaleShowLabels: false,
                scaleBeginAtZero: true
            }
        }
    };



  /*----------------------------------Transaction Information-----------------------------------------*/
    $scope.SpecifictransactionInfoModal = function (transaction,id) {
        if(id==1){
            console.log("hello  1");
            $scope.voteTransaction= true;
            $scope.stakeTransaction= false; 
            
        }else if(id==2){
            console.log("hello  2");
            $scope.sponsor = Object.keys(transaction.asset.airdropReward.sponsors)[0]
            $scope.stakeTransaction= true; 
            $scope.voteTransaction= false;
        }
        console.log(transaction,"-----------------------");
        $scope.modal = SpecifictransactionInfoModal.activate({ transaction: transaction });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.transactionInfo = function (transaction) {
        $scope.modal = transactionInfo.activate({ transaction: transaction });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.blockInfo = function (blockID) {
        $http.get($rootScope.serverUrl + "/api/blocks/get", {
            params: {
                id: blockID
            }
        }).then(function (response) {
            transactionInfo.deactivate();
            $scope.modal = blockInfo.activate({ block: response.data.block });
            angular.element(document.querySelector("body")).addClass("ovh");
        }
        );
    }

    $scope.resetAppData = function () {
        $scope.balance = userService.balance = 0;
        $scope.unconfirmedBalance = userService.unconfirmedBalance = 0;
        $scope.balanceToShow = [0]
        $scope.secondPassphrase = userService.secondPassphrase = 0;
        $scope.unconfirmedPassphrase = userService.unconfirmedPassphrase = 0;
        userService.multisignatures = userService.u_multisignatures = null;
        $scope.multisignature = false;
        $scope.delegateInRegistration = userService.delegateInRegistration = null;
        $scope.delegate = userService.delegate = null;
        $scope.username = userService.username = null;
    }

    $scope.userInfo = function (userId) {
        $scope.modal = userInfo.activate({ userId: userId });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.getTransactions = function () {
           $http.get($rootScope.serverUrl + "/api/transactions", {
            params: {
                senderPublicKey: userService.publicKey,
                recipientId: $scope.address,
                limit: 8,
                orderBy: 'timestamp:desc'
            }
        }).then(function (resp) {
            var transactions = resp.data.transactions;
            $http.get($rootScope.serverUrl + '/api/transactions/unconfirmed', {
                params: {
                    senderPublicKey: userService.publicKey,
                    address: userService.address
                }
            }).then(function (resp) {
                var unconfirmedTransactions = resp.data.transactions;

                $timeout(function () {
                    $scope.transactions = _.compact(
                        unconfirmedTransactions.concat(transactions).slice(0, 8)
                    );
                });
            });
        });
    }

    $scope.getAccount = function () {
        $http.get($rootScope.serverUrl + "/api/accounts", { params: { address: userService.address } }).then(function (resp) {
            $scope.view.inLoading = false;
            if (resp.data.account) {
                var account = resp.data.account;
                userService.username = account.username;
                userService.balance = account.balance;
                userService.multisignatures = account.multisignatures;
                userService.u_multisignatures = account.u_multisignatures;
                userService.unconfirmedBalance = account.unconfirmedBalance;
                userService.secondPassphrase = account.secondSignature || account.unconfirmedSignature;
                userService.unconfirmedPassphrase = account.unconfirmedSignature;
                userService.totalFrozeAmount = account.totalFrozeAmount;
                $scope.balance = userService.balance;
                $scope.unconfirmedBalance = userService.unconfirmedBalance;
                
                $scope.balanceToShow = $filter('decimalFilter')(userService.unconfirmedBalance - userService.totalFrozeAmount);
                if ($scope.balanceToShow[1]) {
                    $scope.balanceToShow[1] = '.' + $scope.balanceToShow[1];
                }
                $scope.secondPassphrase = userService.secondPassphrase;
                $scope.unconfirmedPassphrase = userService.unconfirmedPassphrase;
                $scope.availableBalanceDec = ($scope.unconfirmedBalance - userService.totalFrozeAmount) / 100000000;
            } else {
                $scope.resetAppData();
            }
        });
    }

    /* For total stakeholders */
    $scope.getStakeholdersCount = function () {
        $http.get($rootScope.serverUrl + "/api/frogings/countStakeholders")
            .then(function (resp) {
                if (resp.data.success) {
                    var countStakeholders = resp.data.countStakeholders.count;
                    $scope.countStakeholders = JSON.parse(countStakeholders);
                } else {
                    Materialize.toast(resp.data.error, 3000, 'red white-text');
                }
            });
    }

    /* For Circulating Supply */
    $scope.getCirculatingSupply = function () {
        $http.get($rootScope.serverUrl + "/api/accounts/getCirculatingSupply")
            .then(function (resp) {
                if (resp.data.success) {
                    var circulatingSupply = resp.data.circulatingSupply / 100000000;
                    $scope.circulatingSupply = parseInt(circulatingSupply);
                } else {
                    Materialize.toast(resp.data.error, 3000, 'red white-text');
                }
            });
    }

    /* For Total Count*/
    $scope.getAccountHolders = function () {
        $http.get($rootScope.serverUrl + "/api/accounts/count")
            .then(function (resp) {
                if (resp.data.success) {
                    var totalCount = resp.data.count;
                    $scope.totalCount = JSON.parse(totalCount);
                } else {
                    Materialize.toast(resp.data.error, 3000, 'red white-text');
                }
            });
    }

    /* For Your DDK Frozen */
    $scope.getMyDDKFrozen = function () {
        $scope.myDDKFrozen = userService.totalFrozeAmount / 100000000;
        $scope.stakeBalanceToShow = $filter('decimalFilter')(userService.totalFrozeAmount);
        if ($scope.stakeBalanceToShow[1]) {
            $scope.stakeBalanceToShow[1] = '.' + $scope.stakeBalanceToShow[1];
        }
    }


    /* For Your total supply */
    $scope.getTotalSupply = function () {
        $http.get($rootScope.serverUrl + "/api/accounts/totalSupply")
            .then(function (resp) {
                if (resp.data.success) {
                    var totalSupply = resp.data.totalSupply / 100000000;
                    $scope.totalSupply = JSON.parse(totalSupply);
                } else {
                    Materialize.toast(resp.data.error, 3000, 'red white-text');
                }
            });
    }

    /* For total DDK staked by stakeholders */
    $scope.getTotalDDKStaked = function () {
        $http.get($rootScope.serverUrl + "/api/frogings/getTotalDDKStaked")
            .then(function (resp) {
                if (resp.data.success) {
                    var totalDDKStaked = resp.data.totalDDKStaked.sum / 100000000;
                    $scope.totalDDKStaked = (totalDDKStaked);
                    $scope.totalStakeBalanceToShow = $filter('decimalFilter')(resp.data.totalDDKStaked.sum);
                    if ($scope.totalStakeBalanceToShow[1]) {
                        $scope.totalStakeBalanceToShow[1] = '.' + $scope.totalStakeBalanceToShow[1];
                    }
                } else {
                    Materialize.toast(resp.data.error, 3000, 'red white-text');
                }
            });
    }

    $scope.$on('$destroy', function () {
        $interval.cancel($scope.balanceInterval);
        $scope.balanceInterval = null;
        $interval.cancel($scope.transactionsInterval);
        $scope.transactionsInterval = null;
    });

    $scope.addSecondPassphrase = function () {
        $scope.secondPassphraseModal = secondPassphraseModal.activate({
            totalBalance: $scope.unconfirmedBalance,
            destroy: function (r) {
                $scope.updateAppView();
                if (r) {
                    $scope.unconfirmedPassphrase = true;
                }
            }
        });
    }

    $scope.referralLink = function () {
        $scope.referralLinkModal = referralLinkModal.activate({
            destroy: function () {
            }
        });
        angular.element(document.querySelector("body")).addClass("ovh");
    }

    $scope.updateAppView = function () {
        $scope.getAccount();
        $scope.getTransactions();
        $scope.getStakeholdersCount();
        $scope.getCirculatingSupply();
        $scope.getAccountHolders();
        $scope.getMyDDKFrozen();
        $scope.getTotalSupply();
        $scope.getTotalDDKStaked();
        delegateService.getDelegate($scope.publicKey, function (response) {
            $timeout(function () {
                $scope.delegate = response;
            });
        });
    }

    $scope.$on('updateControllerData', function (event, data) {
        $scope.$$listeners.updateControllerData.splice(1);
        if ((data.indexOf('main.dashboard') != -1 && $state.current.name == 'main.dashboard') || data.indexOf('main.transactions') != -1) {
            $scope.updateAppView();
        }
    });

    $scope.$on('updateTotalStakeAmount', function (event, data) {
        $scope.$$listeners.updateControllerData.splice(1);
        if ((data.indexOf('main.dashboard') != -1 && $state.current.name == 'main.dashboard') || data.indexOf('main.transactions') != -1) {
            $scope.updateAppView();
        }
    });

    $scope.$on('updateTotalStakeAmount', function (ev, data) {
        $scope.getAccount();
        $scope.getTotalDDKStaked();
    });

    $scope.updateAppView();
    /*   $scope.getCandles(); */


}]);
