'use strict';

var Etcd = require('node-etcd');
var assert = require('assert');
var etcd2json = require('../index.js');
var etcdHosts = process.env.ETCD_HOST.split(',') || ['127.0.0.1:4001'];
var etcdClient = new Etcd(etcdHosts);

// etcd configs structure is the same as structure in README
describe('etcd2json', function(){
  it('should return correct default configs', function(done){
    var etcdConfigs = etcd2json.retrieve(etcdClient, '/v1/test/default');
    assert.equal(etcdConfigs.mongoUrl, 'localhost');
    assert.equal(etcdConfigs.rabbitmqUrl, 'localhost');
    assert.equal(etcdConfigs.redis.length, 2);
    done();
  });

  it('should return correct app configs', function(done){
    var etcdConfigs = etcd2json.retrieveMultiPath(etcdClient, ['/v1/test/default', '/v1/test/app']);
    assert.equal(etcdConfigs.mongoUrl, '127.0.0.1:12345');
    assert.equal(etcdConfigs.rabbitmqUrl, 'localhost');
    assert.equal(etcdConfigs.isDeploy, true);
    assert.equal(etcdConfigs.special, '');
    assert.equal(etcdConfigs.elasticSearch.length, 3);
    assert.equal(etcdConfigs.redis.length, 2);
    done();
  });
});
