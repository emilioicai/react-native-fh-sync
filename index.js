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
    body.__fh = {
      cuid: getClientId()
    };
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

var uuidGenerator = require('uuid').v1;
// Get unique client id (store it for future usages)
function getClientId() {
    var clientId;
    if (window && window.localStorage) {
        clientId = window.localStorage.getItem(CLIENT_ID_TAG);
        if (!clientId) {
            clientId = uuidGenerator();
            localStorage.setItem(CLIENT_ID_TAG, clientId);
        }
    } else {
        clientId = uuidGenerator();
    }
    return clientId;
}

RNSync.doCreate = sync.doCreate;
RNSync.doList = sync.doList;
RNSync.notify = sync.notify;
RNSync.manage = sync.manage;

export default RNSync;