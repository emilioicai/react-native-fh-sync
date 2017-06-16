RNSync
========================

React Native library to synchronize with a fh-sync server 

## Required setup

To use the sync client you need a sync server setup first see https://github.com/feedhenry/fh-sync

```javascript
import RNSync from 'react-native-fh-sync';

RNSync.init({
  datasetId: <your dataset id>,
  url: <your sync server url>
});

RNSync.notify((notification) => {
  var code = notification.code
  if('sync_complete' === code){
    //a sync loop completed successfully, list the update data
    RNSync.doList(this.messagesId,
      (res) => {
        
        ...

      },
      function (err) {
        
        ...

      });
  } else {
    //choose other notifications the app is interested in and provide callbacks
  }
});

const queryParams = {};
const metaData = {};
RNSync.manage(this.messagesId, {}, queryParams, metaData, () => {});

```

## Example

You can find a sample app in the example folder