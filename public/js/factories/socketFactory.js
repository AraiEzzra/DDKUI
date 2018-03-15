require('angular');

var config = require('../../../config');
var url = config.serverProtocol + '://' +config.serverHost + ':' + config.serverPort;

angular.module('ETPApp').factory('serverSocket', ["socketFactory", "$location", function (socketFactory, $location) {
    //FIXME: Use @newIoSocket if front-end and back-end running on same server
    //var newIoSocket = io.connect($location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : ''));
    
    var newIoSocket = io.connect(url);
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
