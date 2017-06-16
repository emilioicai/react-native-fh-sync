import sync from 'fh-sync-js';
import sha1 from 'sha1';
import { AsyncStorage } from 'react-native';

var RNSync = {};

RNSync.init = function(config) {
  const url = config.url;

  sync.setStorageAdapter(function(datasetId, isSave, cb){
    cb(null, {
      get: function(payload, cb){
        AsyncStorage.getItem('__sync__' + datasetId, cb);
      },
      save: function(payload, cb){
        AsyncStorage.setItem('__sync__' + datasetId, JSON.stringify(payload), cb);
      }
    });
  });

  sync.setHashMethod(sha1);

  sync.setCloudHandler(function (params, success, failure) {
    var body = params.req;
    fetch(url + params.dataset_id, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      success(response);
    })
    .catch((error) => {
      failure(error);
    });
  });

  sync.init({
    "sync_frequency": 10,
    "do_console_log": true
  });
}

RNSync.doCreate = sync.doCreate;
RNSync.doList = sync.doList;
RNSync.notify = sync.notify;
RNSync.manage = sync.manage;

export default RNSync;