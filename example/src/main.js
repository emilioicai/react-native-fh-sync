import React, { Component } from 'react';
import { Container, Content, List, ListItem, Text, Fab } from 'native-base';
import RNSync from 'react-native-fh-sync';
import prompt from 'react-native-prompt-android';

export default class syncExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {}
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
      } else {
        //choose other notifications the app is interested in and provide callbacks
      }
    });

    const queryParams = {};
    const metaData = {};
    RNSync.manage(this.messagesId, {}, queryParams, metaData, () => {});
  }
  
  _addNewMessage(text){
    RNSync.doCreate(this.messagesId, text, (res) => {
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
      <Container style={{marginTop: 20}}>
          <Content>
              <List>
                {
                  messages.map((m, i)=>{
                    return (
                      <ListItem key={i}>
                        <Text>{m}</Text>
                      </ListItem>
                    )
                  })
                }
              </List>
          </Content>
          <Fab
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={this._handleAddMessagePress.bind(this)}
          >
            <Text>+</Text>
          </Fab>
      </Container>
    );
  }
}
