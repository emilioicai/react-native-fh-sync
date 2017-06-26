import React, { Component } from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import RNSync from 'react-native-fh-sync';
import prompt from 'react-native-prompt-android';

export default class syncExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {},
      curMessage: ''
    }
    this.messagesId = 'messages';
  }
  
  componentWillMount() {
    RNSync.init({
      datasetId: this.messagesId,
      url: 'http://localhost:3000/sync/'
    });

    RNSync.notify((notification) => {
      var code = notification.code
      if('sync_complete' === code){
        //a sync loop completed successfully, list the update data
        RNSync.doList(this.messagesId,
          (res) => {
            console.log('Successful result from list:', JSON.stringify(res));
            if(JSON.stringify(res) !== JSON.stringify(this.state.messages) ){
              this.setState({
                messages: res
              });
            }
            
          },
          function (err) {
            console.log('Error result from list:', JSON.stringify(err));
          });
      } else if( 'remote_update_failed' === notification.code ){
        var errorMsg = notification.message ? notification.message.msg ? notification.message.msg : undefined : undefined;
        var action = notification.message ? notification.message.action ? notification.message.action : 'action' : 'action';
        var errorStr = 'The following error was returned from the data store: ' + errorMsg;

        console.error('Unable to perform ' + action +  ' on record ' + notification.uid + '. ' + errorStr);
      }
    });

    const queryParams = {};
    const metaData = {};
    RNSync.manage(this.messagesId, {}, queryParams, metaData, () => {
      console.log('-----------', 'DATA SET MANAGED' ,'-----------')
    });
  }
  
  _addNewMessage(text){
    var created = new Date().getTime();
    var dataItem = {
      "text" : text,
      "created" : created
    }
    RNSync.doCreate(this.messagesId, dataItem, (res) => {
      console.log('Create item success');
    }, function(code, msg) {
      alert('An error occured while creating data : (' + code + ') ' + msg);
    });
  }
  
  _handleAddMessagePress(){
    prompt(
      'Enter message',
      '',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: this._addNewMessage.bind(this) }
      ],
      {
        type: 'plain-text'
      }
    );
  }

  render() {
    var messages = [];
    for(var key in this.state.messages) {
      messages.push(this.state.messages[key].data);
    }

    return (
      <View style={{marginTop: 20}}>   
        <Button
          onPress={this._handleAddMessagePress.bind(this)}
          title="Add Message"
          color="#841584"
        />
        {
          messages.map((m, i)=>{
            return (
                <Text key={i}>{m.text}</Text>
            )
          })
        }
      </View>
    );
  }
}
