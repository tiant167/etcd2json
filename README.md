# etcd2json
turn etcd configs to json

## Rules
- A `Dictionary` is an `Object` or `Array`.
- A `Property` is a `key-value pair`, or `Array Element`.
- If the name of `Dictionary` or `Property` is a number, then the parent node will be casted into an `Array`
- String `true` and `false` will be turned into Boolean
- If number and letter key name exists in the same level, the final result will be decided by the last element.

## Usage
```javascript
var etcd2json = require('etcd2json');
var etcdHosts = process.env.ETCD_HOST.split(',') || ['127.0.0.1:2379'];
var etcdClient = new Etcd(etcdHosts);
var defaultResult = etcd2json.retrieve(etcdClient, '/v1/production/default');
var appResult = etcd2json.retrieveMulti(etcdClient, ['/v1/production/default', '/v1/production/app1']);
```

There are two functions, `retrieve` and `retrieveMulti`.
You can pass an array to `retrieveMulti` function. The latter value will overwrite the previous value, if they have the same key.

## Examples
### Etcd Configs
- + v1
-- + production
--- + default
---- - mongoUrl: localhost
---- - rabbitmqUrl: localhost
---- + redis:
----- + 1
------ - host: 127.0.0.1
------ - port: 3306
----- + 2
------ - host: 127.0.0.2
------ - port: 3306
--- + app1
---- - mongoUrl: 127.0.0.1:12345
---- - isDeploy: true
---- + elasticSearch
----- - 1: 127.0.0.1:9200
----- - 2: 127.0.0.2:9200
----- - 3: 127.0.0.3:9200

### JSON Result
```
{
  "mongoUrl": "127.0.0.1:12345",
  "rabbitmqUrl": "localhost",
  "isDeploy": true,
  "redis": [
    {
      host: "127.0.0.1",
      port: "3306"
    },
    {
      host: "127.0.0.2",
      port: "3306"
    }
  ],
  "elasticSearch": [
    "127.0.0.1:9200",
    "127.0.0.2:9200",
    "127.0.0.3:9200"
  ]
}
```
