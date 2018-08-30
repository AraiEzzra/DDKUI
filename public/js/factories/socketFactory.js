require('angular');

angular.module('DDKApp').factory('serverSocket', ["socketFactory", "$location", "$rootScope", "userService", function (socketFactory, $location, $rootScope, userService) {
    //FIXME: Use @newIoSocket if front-end and back-end running on same server
    //var newIoSocket = io.connect($location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : ''));
    //console.log($location.port());
    var newIoSocket = io.connect($rootScope.serverUrl);
    newIoSocket.on('connect', function() {
        var userAddress = userService.address;
		if(userAddress) {
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

    return serverSocket;

}]);
