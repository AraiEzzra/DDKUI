require('angular');
require('angular-ui-router');
require('angular-resource');
require('angular-filter');
require('angular-cookies');
require('browserify-angular-animate');
require('../node_modules/angular-animate/angular-animate.js')
require('../node_modules/angular-gettext/dist/angular-gettext.min.js');
require('../node_modules/angular-chart.js/dist/angular-chart.js');
require('../node_modules/angular-socket-io/socket.js');
require('../node_modules/ng-table/dist/ng-table.js');
require('../bower_components/bootstrap/dist/js/bootstrap.min.js');

require('../node_modules/elasticsearch-browser/elasticsearch.angular.min.js');

Mnemonic = require('bitcore-mnemonic');

DDKApp = angular.module('DDKApp', ['ui.router', 'btford.modal', 'ngCookies', 'ngTable', 'ngAnimate', 'chart.js', 'btford.socket-io', 'ui.bootstrap', 'angular.filter', 'gettext', 'elasticsearch']);

DDKApp.config([
    "$locationProvider",
    "$stateProvider",
    "$urlRouterProvider",
    "$tooltipProvider",
    function ($locationProvider, $stateProvider, $urlRouterProvider, $tooltipProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");

        $tooltipProvider.setTriggers({
            'click': 'mouseleave',     
        });

        // Now set up the states
        $stateProvider
            .state('main', {
                abstract: true,
                templateUrl: "/partials/template.html",
                controller: "templateController"
            })
            .state('main.dashboard', {
                url: "/dashboard",
                templateUrl: "/partials/account.html",
                controller: "accountController"
            })
            .state('main.explorer', {
                url: "/explorer",
                templateUrl: "/partials/explorer.html",
                controller: "explorerController"
            })
            .state('main.stake', {
                url: "/stake",
                templateUrl: "/partials/stake.html",
                controller: "stakeController"
            })
            .state('main.settings', {
                url: "/settings",
                templateUrl: "/partials/settings.html",
                controller: "settingsController"
            })
            .state('main.transactions', {
                url: "/transactions",
                templateUrl: "/partials/transactions.html",
                controller: "transactionsController"
            })
            .state('main.delegates', {
                url: "/delegates",
                templateUrl: "/partials/delegates.html",
                controller: "delegatesController"
            })
            .state('main.votes', {
                url: "/delegates/votes",
                templateUrl: "/partials/votes.html",
                controller: "votedDelegatesController"
            })
            .state('main.forging', {
                url: "/forging",
                templateUrl: "/partials/forging.html",
                controller: "forgingController"
            })
            .state('main.blockchain', {
                url: "/blockchain",
                templateUrl: "/partials/blockchain.html",
                controller: "blockchainController"
            })
            .state('main.withdrawl', {
                url: "/withdrawl",
                templateUrl: "/partials/withdrawl.html",
                controller: "withdrawlController"
            })
            .state('existingETPSUser', {
                url: "/existingETPSUser",
                templateUrl: "/partials/existing-etps-user.html",
                controller: "existingETPSUserController"
            })
            .state('referal', {
                url: "/referal/:id",
                reloadOnSearch: false,
                templateUrl: "/partials/referal.html",
                controller: "referalController"
            })
            .state('passphrase', {
                url: "/login",
                templateUrl: "/partials/passphrase.html",
                controller: "passphraseController"
            })
            .state('main.referralStatistics', {
                url: "/referralStatistics",
                templateUrl: "/partials/referral-statistics.html",
                controller: "referralStatisticsController"
            })
            .state('loading', {
                url: "/",
                templateUrl: "/partials/loading.html"
            });
    }
]).run(function (languageService, clipboardService, $rootScope, $state, AuthService, $timeout, $stateParams) {
    languageService();
    clipboardService();
    $rootScope.$state = $state;
    $rootScope.serverUrl = 'https://webtestnet-w.ddkoin.com';
    //$rootScope.serverUrl = 'http://159.65.139.248:7000';
    //$rootScope.serverUrl = 'http://localhost:7000';
    $rootScope.defaultLoaderScreen = false;

    // render current logged-in user upon page refresh if currently logged-in
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        AuthService.getUserStatus()
            .then(function () {
                if (AuthService.isLoggedIn()) {
                        if (toState.name != 'loading')
                            $state.go(toState.name);
                        else
                            $state.go('main.dashboard');
                    
                } else {
                    if (toState.name == 'referal') {
                        $state.go('referal');
                    } else if (toState.name == 'existingETPSUser') {
                        $state.go('existingETPSUser');
                    } else
                        $state.go('passphrase');
                }
            });
    });

    // user authentication upon page forward/back for currently logged-in user
   /*  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {

        AuthService.getUserStatus()
            .then(function () {
                if (!AuthService.isLoggedIn() && toState.url != '/referal/:id' && toState.url != '/existingETPSUser') {
                    $state.go('passphrase');
                }
            });
    }); */
});
