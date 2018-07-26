require('angular');

angular.module('DDKApp').service('blockService', function ($http, esClient, $filter) {
    function filterData(data, filter) {
        return $filter('filter')(data, filter)
      }
    
      function orderData(data, params) {
        return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
      }
    
      function sliceData(data, params) {
        return data.slice((params.page() - 1) * params.count(), params.page() * params.count())
      }
    
      function transformData(data, filter, params) {
        return sliceData(orderData(filterData(data, filter), params), params);
      }
    // modified search with elasticsearch
    var blocks = {
        lastBlockId: null,
        searchForBlock: '',
        gettingBlocks: false,
        cached: { data: [], time: new Date() },
        getBlock: function (blockId, cb) {
            esClient.search({
                index: 'blocks_list',
                type: 'blocks_list',
                body: {
                    query: {
                        match: {
                            "b_id": blockId
                        }
                    },
                }
            }, function (error, blockResponse, status) {
                if(error) {
                    console.log('Elasticsearch ID Search Error: ', error);
                } else {
                    if (blockResponse.hits.hits.length == 0) {
                        cb({ blocks: [], count: 0 });
                    } else {
                        cb({ blocks: [blockResponse.hits.hits[0]._source], count: 1 });
                    }
                }
            });
        },
        getBlocks: function (searchForBlock, $defer, params, filter, cb, address, fromBlocks) {
            blocks.searchForBlock = searchForBlock.trim();
            if (blocks.searchForBlock != '') {
                this.getBlock(blocks.searchForBlock, function (response) {
                    if (response.count) {
                        params.total(response.count);
                        $defer.resolve(response.blocks);
                        cb(null);
                    }
                    else {
                        esClient.search({
                            index: 'blocks_list',
                            type: 'blocks_list',
                            body: {
                                query: {
                                    match: {
                                        "b_height": blocks.searchForBlock
                                    }
                                }
                            }
                        }, function (error, blockResponse, status) {
                            if(error) {
                                console.log('Elasticsearch Height Search Error: ', error);
                            } else {
                                if (error) {
                                    params.total(0);
                                    $defer.resolve();
                                    cb({ blocks: [], count: 0 });
                                } else {
                                    if (blockResponse.hits.hits.length > 0) {
                                        params.total(1);
                                        $defer.resolve([blockResponse.hits.hits[0]._source]);
                                        cb(null);
                                    } else {
                                        params.total(0);
                                        $defer.resolve();
                                        cb({ blocks: [], count: 0 });
                                    }
                                }
                            }
                        });
                    }
                });
            }
            else {
                if (true) {
                    esClient.search({
                        index: 'blocks_list',
                        type: 'blocks_list',
                        body: {
                            from: (params.page() - 1) * params.count(),
                            size: params.count(),
                            query: {
                                match_all: {}
                            },
                            sort: [{ b_height: { order: 'desc' } }],
                        }
                    }, function (error, blocksResponse, status) {
                        if(error) {
                            console.log('Elasticsearch Error: ', error);
                        } else {
                            if (fromBlocks) {
                                esClient.search({
                                    index: 'blocks_list',
                                    type: 'blocks_list',
                                    body: {
                                        query: {
                                            match_all: {}
                                        },
                                        sort: [{ b_height: { order: 'desc' } }],
                                    }
                                }, function (err, res) {
                                    if(err) {
                                        console.log('Elasticsearch Error:err ', err);
                                    } else {
                                        if (res.hits.hits[0]._source.b_height) {
                                            params.total(res.hits.hits[0]._source.b_height);
                                        } else {
                                            params.total(0);
                                        }
                                        if (blocksResponse.hits.hits.length > 0) {
                                            blocksData = [];
                                            blocks.lastBlockId = blocksResponse.hits.hits[0]._source.b_id;
                                            cb();
                                            blocksResponse.hits.hits.forEach(function (block) {
                                                blocksData.push(block._source);
                                            });
                                            $defer.resolve(blocksData);
                                        } else {
                                            blocks.lastBlockId = 0;
                                            cb();
                                            $defer.resolve([]);
                                        }
                                    }
                                });
                            } else {
                                esClient.search({
                                    index: 'blocks_list',
                                    type: 'blocks_list',
                                    body: {
                                        "query": {
                                            "bool": {
                                                "must": [
                                                    {
                                                        "match_all": {}
                                                    },
    
                                                    {
                                                        "term": {
                                                            "b_generatorId.keyword": address
                                                        }
                                                    }
                                                ],
                                                "must_not": [],
                                                "should": []
                                            }
                                        },
                                        "from": (params.page() - 1) * params.count(),
                                        "size": params.count(),
                                        "sort": [{ b_height: { order: 'desc' } }],
                                        "aggs": {}
                                    }
                                }, function (err, res) {
                                    if(err) {
                                        console.log('Elasticsearch Address Search Error: ', err);
                                    } else {
                                        var blocksData = [];
                                        res.hits.hits.forEach(function (block) {
                                            blocksData.push(block._source);
                                        });
                                        if (blocksData != null) {
                                            params.total(res.hits.total);
                                            $defer.resolve(blocksData);
                                        }
                                        cb(null);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    }
    return blocks;
});
