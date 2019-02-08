require('angular');

angular.module('DDKApp').factory('serverSocket', ["socketFactory", "$location", "$rootScope", "userService", function (socketFactory, $location, $rootScope, userService) {

    var newIoSocket = io.connect($rootScope.serverUrl);
    newIoSocket.on('connect', function () {
        var userAddress = userService.address;
        if (userAddress) {
            newIoSocket.emit('setUserAddress', {
                'address': userAddress
            });
        }
    });

    serverSocket = socketFactory({
        ioSocket: newIoSocket
    });

    serverSocket.forward('transactions/change');
    serverSocket.forward('blocks/change');
    serverSocket.forward('delegates/change');
    serverSocket.forward('multisignatures/change');
    serverSocket.forward('multisignatures/signatures/change');
    serverSocket.forward('dapps/change');
    serverSocket.forward('rounds/change');
    serverSocket.forward('updateConnected');
    serverSocket.forward('stake/change');
    serverSocket.forward('milestone/change');
    serverSocket.forward('updateTotalStakeAmount');
    serverSocket.forward ('pool/verify');

    return serverSocket;

}]);
