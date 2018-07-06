// added new service to check status of elasticsearch server

//var config = require('../../../config.json');
var config = require('../../../config');
var connectionHost = config.elasticsearchHost + ':9200' || 'localhost:9200';

angular.module('DDKApp').service('esClient', function (esFactory) {
    return esFactory({
        host: connectionHost,
        log: 'error'
    });
});

