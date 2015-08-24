'use strict';

var _ = require('lodash');

var etcdConfigs = module.exports = {
  retrieve: function retrieve(etcdClient, path){
    var req = etcdClient.getSync(path);
    var objResult = {};
    var arrResult = [];
    var result = objResult;
    if(_.isEmpty(req.body)) return null;
    _.forEach(req.body.node.nodes, function(n) {
      // key is the node name without path
      var subKey = n.key.slice(path.length + 1);
      var v;
      if (!n.dir) {
        v = n.value;
        // turn true and false to boolean
        if (v === 'false' || v === 'true'){
          v = v === 'true';
        }
      } else {
        // if the node is  a dir, then recursive
        v = retrieve(etcdClient, n.key);
      }
      // we supposed that if the key is a number, the properties are in array format
      if (isNaN(parseInt(subKey, 10))){
        // normal key: value
        objResult[subKey] = v;
        result = objResult;
      } else {
        // v may be everything
        // if dictionary name is number, then it will turns to something like [{}, {}] or [[],[]]
        // but the same level properties or dictionaries should also be number, otherwise the final result will be decided by the last element.
        arrResult.push(v);
        result = arrResult;
      }
    });
    return result;
  },
  random: function random(etcdClient,path){
    var list = etcdConfigs.retrieve(etcdClient,path);
    var keys = _.keys(list);
    if(keys.length == 0){
      return list[keys[0]];
    }else{
      return list[keys[_.random(0,keys.length-1)]];
    }
  },
  retrieveMultiPath: function retrieveMultiPath(etcdClient, paths){
    var result = {};
    if (_.isArray(paths)){
      // The latter value will overwrite the previous value, if they have the same key
      _.forEach(paths, function(path){
        _.assign(result, etcdConfigs.retrieve(etcdClient, path));
      });
    } else {
      result = etcdConfigs.retrieve(etcdClient, paths);
    }
    return result;
  }
};
