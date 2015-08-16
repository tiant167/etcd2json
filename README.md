# etcd2json
turn etcd configs to json

## Rules
- A `Dictionary` is an `Object` or `Array`.
- A `Property` is a `key-value pair`, or `Array Element`.
- If the name of `Dictionary` or `Property` is a number, then the parent node will be casted into an `Array`
- String `true` and `false` will be turned into Boolean
- If number and letter key name exists in the same level, the final result will be decided by the last element.
- Empty `Property` and `Dictionary` will be turned into `''` and `{}`

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
<ul>
  <li>+ v1</li>
  <ul>
    <li>+ production</li>
    <ul>
      <li>+ default</li>
      <ul>
        <li>- mongoUrl: localhost</li>
        <li>- rabbitmqUrl: localhost</li>
        <li>+ redis:</li>
        <ul>
          <li>+ 1</li>
          <ul>
            <li>- host: 127.0.0.1</li>
            <li>- port: 3306</li>
          </ul>
          <li>+ 2</li>
          <ul>
            <li>- host: 127.0.0.2</li>
            <li>- port: 3306</li>
          </ul>
        </ul>
      </ul>
      <li>+ app1</li>
      <ul>
        <li>- mongoUrl: 127.0.0.1:12345</li>
        <li>- isDeploy: true</li>
        <li>- special: <i>(Empty)</i></li>
        <li>+ elasticSearch</li>
        <ul>
          <li>- 1: 127.0.0.1:9200</li>
          <li>- 1: 127.0.0.2:9200</li>
          <li>- 1: 127.0.0.2:9200</li>
        </ul>
      </ul>
    </ul>
  </ul>
</ul>

### JSON Result
```
{
  "mongoUrl": "127.0.0.1:12345",
  "rabbitmqUrl": "localhost",
  "isDeploy": true,
  "special": "",
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
