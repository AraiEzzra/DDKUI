// added new service to check status of elasticsearch server

//var config = require('../../../config.json');
var config = require('../../../config');
var connectionHost = config.elasticsearchHost || 'localhost:9200';

// TODO: Fix elasticsearch host

angular.module('DDKApp').service('esClient', function (esFactory) {
    return esFactory({
        host: `elasticsearch.${window.location.hostname}`,
        log: 'error'
    });
});
