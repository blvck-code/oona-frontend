import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {messageChannel} from '../../../../environments/environment';
import {AuthService} from '../../../auth/services/auth.service';
import {MessagingService} from './messaging.service';
import { webSocket } from 'rxjs/webSocket';
import { environment as env } from '../../../../environments/environment';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import * as authActions from '../../../auth/state/auth.actions';
import {Router} from '@angular/router';
import {SingleMessageModel} from '../models/messages.model';
import * as messagingActions from '../state/messaging.actions';

const msgSocket = webSocket(messageChannel);

@Injectable({
  providedIn: 'root'
})
export class OonaSocketService {

  allMessagesCounter = 0;
  allMsgCounterSubject = new BehaviorSubject<number>(this.allMessagesCounter);
  allMsgCounterObservable = this.allMsgCounterSubject.asObservable();

  privateMessagesCounter = 0;
  privateMsgCounterSubject = new BehaviorSubject<number>(this.privateMessagesCounter);
  privateMsgCounter = this.privateMsgCounterSubject.asObservable();

  public recognizedUsers = Array();
  private usersSocket = new BehaviorSubject(this.recognizedUsers);
  currentUsers = this.usersSocket.asObservable();

  newMessages = Array();
  newMessagesUnique = new Set();
  newMessageCount = 0;
  messageCountSocket = new BehaviorSubject(this.newMessageCount);
  messageCount = this.messageCountSocket.asObservable();

  messagesToStreams = Array();
  streamMessageCountSocket = new BehaviorSubject(this.messagesToStreams);
  streamMessageSocket = this.streamMessageCountSocket.asObservable();

  messagesInPrivate = Array();
  privateMessageCountSocket = new BehaviorSubject(this.messagesInPrivate);
  privateMessageSocket = this.privateMessageCountSocket.asObservable();

  myMessages = Array();
  myMessagesSocketSubject = new BehaviorSubject(this.myMessages);
  myMessagesSocket = this.myMessagesSocketSubject.asObservable();

  myStreamMessages = Array();
  myStreamMessagesSocketSubject = new BehaviorSubject(this.myStreamMessages);
  myStreamMessagesSocket = this.myStreamMessagesSocketSubject.asObservable();

  newMsgCounter = 0;
  newMsgCounterSubject = new BehaviorSubject<number>(this.newMsgCounter);
  newMsgCounterObservable = this.newMsgCounterSubject.asObservable();

  newMessagesId: any[] = [];
  messagesId: number[] = [];

  newStream: any[] = [];
  newStreamSubject = new BehaviorSubject(this.newStream);
  newStreamObservable = this.newStreamSubject.asObservable();

  peopleType = Array();
  public typingStatus = Array();
  private typingStatusSocket = new BehaviorSubject(this.recognizedUsers);
  typing = this.typingStatusSocket.asObservable();

  private websocket: WebSocket | undefined;
  private loggedInUserProfile: any;


  constructor(
    private authService: AuthService,
    private messagingService: MessagingService,
    private route: Router,
    private store: Store<AppState>
  ) {
    this.getCurrentProfile();
    this.connect();
    this.userManagement();
  }

  notifyMe(message: SingleMessageModel): void {
    console.log('Notification message ', message);
    if (!('Notification' in window)) {
      // Check if the browser supports notifications
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {

      if (!message.is_me_message){
        const notification = new Notification(message.sender_full_name, {
          body: message.content,
          icon: message.avatar_url
        });
      }
    } else if (Notification.permission !== 'denied') {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          console.log('Messages access granted');
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }

  changeNewMessageCount(newCount: any): void {
    // console.log('Message counter ===>>', newCount);
    this.messageCountSocket.next(newCount);
  }

  changeNewStreamMessageCount(newStreamMessages: any): void {
    // console.log('newStreamMessages ===>>>', newStreamMessages);
    this.streamMessageCountSocket.next(newStreamMessages);
  }

  changeNewPrivateMessageCount(newPrivateMessages: any): void {
    // console.log('changeNewPrivateMessageCount ==>>', newPrivateMessages);
    this.privateMessageCountSocket.next(newPrivateMessages);
  }

  changeTypingStatus(status: any): void {
    // console.log('Typing status ==>>', status);
    this.typingStatusSocket.next(status);
  }

  newMessageCounter(msg: SingleMessageModel): void {

    if (this.newMessagesId.includes(msg.id)){
      return;
    }

    // console.log('New message item ===>>>', msg)

    this.allMsgCounterSubject.next(this.allMessagesCounter + 1);
    this.newMessagesId.push(msg.id);
  }

  connect(): void {
    /**
     * Creates a websocket connection to the user channel
     */
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const url: string = env.userChannel;
    const userChannel = protocol + url;
    this.websocket = new WebSocket(userChannel, this.authService.getToken());
  }

  filterSocketData(userData: any): void {
    /*
     * Filters all active and inactive users
     * @param userData Incoming message from the server.
     * @return void
     */

    const socketData  = JSON.parse(userData);

    // {
    //   "message": {
    //   "operation": "add",
    //   "all": false,
    //   "type": "update_message_flags",
    //   "id": 21,
    //   "messages": [
    //     34424,
    //     34427,
    //     34430,
    //     34431,
    //     34433
    //   ],
    //     "flag": "read"
    // }
    // }

    console.log('Socket data first time ===>>>', socketData);

    if (socketData.message.type === 'presence'){
      // console.log('pushing user presence data');
      this.recognizedUsers.push(socketData);
    } else if (socketData.message.type === 'stream') {

      if (socketData.message.op === 'create'){
        // New stream just created
        this.newStreamSubject.subscribe(
          (streams: any[]) => streams.push(socketData.message.streams)
        );
      }

    } else if (socketData.message.type === 'message'){
      // console.log('message', socketData);
      this.setMessageType(socketData);
      // this.newMessages.push(socketData);
      // create a new set unique by message id
      // this.newMessagesUnique = new Set(this.newMessages.map(item => item.message.message.id));
      this.newMessageCount = this.newMessages.length;
      this.changeNewMessageCount(this.newMessageCount);
      this.newMessageCounter(socketData.message.message);

    } else if (socketData.message.type === 'update_message_flags'){
      // how many messages have been read
      const messagesRead = socketData.message.messages.length;
      this.newMessageCount = this.newMessageCount - messagesRead;
      const newRead = this.newMessageCount - messagesRead;
      if (newRead < 0){
        this.newMessageCount = 0;
        this.changeNewMessageCount(this.newMessageCount);
      }else{
        this.changeNewMessageCount(this.newMessageCount);
      }
    }else if (socketData.message.type === 'typing'){
      const typeData = {
        userId: socketData.message.sender.user_id,
        userEmail: socketData.message.sender.email,
        op: socketData.message.op,
        messageId: socketData.message.id
      };

      const newDataExists = this.peopleType.findIndex(personMessage => personMessage.userEmail === typeData.userEmail);

      if (newDataExists >= 0){
        // data already exists. Hence only push if messageID is greater than that already existing
        // this would be obviously greater. Remove item at this index and replace with new ID
        this.peopleType[newDataExists] = typeData;
      }else{
        this.peopleType.push(typeData);
      }
      const max = this.peopleType.reduce((prev, current) => (prev.messageId > current.messageId) ? prev : current);

      this.changeTypingStatus(this.peopleType);
    }

  }

  userManagement(): void {
    // @ts-ignore
    this.websocket.onmessage = (evt) => {
      this.filterSocketData(evt.data);
    };

    // @ts-ignore
    this.websocket.onclose = (evt) => {
      // console.log('Web socket closed');
      setTimeout(() => {
        this.connect();
      }, 1000);
    };

    // @ts-ignore
    this.websocket.onerror = (evt) => {
      setTimeout(() => {
        // console.log('Attempting to reconnect ...', evt);
        this.connect();
      }, 1000);
    };
  }

  // Filter message types from the socket
  private setMessageType(socketData: any): void {
    const newMessage: SingleMessageModel = socketData.message.message;
    if (this.newMessagesId.includes(newMessage.id)) { return; }
    this.newMessagesId.push(newMessage.id);

    const currentUserId =  this.loggedInUserProfile?.user_id;
    const msgSenderId = socketData.message?.message?.sender_id;
    const recipientOne: SingleMessageModel = socketData.message.message?.display_recipient[0].id;
    const recipientTwo: SingleMessageModel = socketData.message.message?.display_recipient[1].id;

    newMessage.flags = [];
    if (socketData.message.message.type === 'stream'){

      // If i send message to the stream listener
      const incomingMessage: SingleMessageModel = socketData.message.message;
      if (msgSenderId === currentUserId){
        // My outgoing message from the socket
        // console.log('My stream outgoing message content ===>>>', socketData);
        this.myStreamMessagesSocketSubject.next(socketData.message.message);
        incomingMessage.flags = ['read'];
        this.store.dispatch(new messagingActions.CreateStreamMessageSuccess(incomingMessage));
      } else {
        incomingMessage.flags = [];
        this.store.dispatch(new messagingActions.CreateStreamMessageSuccess(incomingMessage));
        this.notifyMe(socketData.message.message);
      }

      // this.store.dispatch(new messagingActions.CreateStreamMessageSuccess(socketData.message.message));
      // this.notifyMe(socketData.message.message);

      this.messagesToStreams = [...this.messagesToStreams, socketData.message.message];
      // let the array have unique messages
      // ! below is done because this socket service is called multiple times across multiple components
      // hence a tendency to have it with duplicate items for each time it is called
      // tslint:disable-next-line:max-line-length
      this.messagesToStreams = this.messagesToStreams.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // have unique messages by id
      // console.log('Messages to streams ===>>>>', this.messagesToStreams);
      this.changeNewStreamMessageCount(this.removeLoggedInUserMessages(this.messagesToStreams));
    }else if (socketData.message.message.type === 'private'){
      const privateMessage: SingleMessageModel = socketData.message.message;


      // send new message to store

      // Check if am the sender or not me
      if (msgSenderId === currentUserId){
        // My outgoing message from the socket
        // console.log('Incoming message from other user ===>>>', socketData.message.message);
        privateMessage.flags = ['read'];
        this.myMessagesSocketSubject.next(socketData.message.message);
        this.store.dispatch(new messagingActions.CreatePrivateMessageSuccess(privateMessage));
      } else if ( recipientOne === currentUserId || recipientTwo === currentUserId ) {
        // Incoming message from other user in socket
        console.log('recipientOne', recipientOne);
        console.log('recipientTwo', recipientTwo);
        console.log('currentUserId', currentUserId);
        privateMessage.flags = [];
        this.store.dispatch(new messagingActions.CreatePrivateMessageSuccess(privateMessage));
        this.notifyMe(privateMessage);
        this.messagesInPrivate = [...this.messagesInPrivate, socketData.message.message];
        this.messagesInPrivate = this.messagesInPrivate.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

        this.changeNewPrivateMessageCount(this.removeLoggedInUserMessages(this.messagesInPrivate));
        this.privateMsgCounterSubject.next(this.privateMessagesCounter + 1);
      }
    } else if (socketData.message.message.type === 'subscription') {

      // console.log('Subscription socket fired ===>>>>', socketData);

    }

    this.newMessages = this.removeLoggedInUserMessages([...this.messagesToStreams, ...this.messagesInPrivate]);
  }

  private getCurrentProfile(): any {
    this.messagingService.currentUserProfile().subscribe( (profile: any) => {
      this.loggedInUserProfile = profile.zulip;
    });
  }

  private removeLoggedInUserMessages(messagesArray: any[]): any{
    // ** as the socket comes with data even though the current logged in user sent teh text,
    // remove this logged in user from the messages array.
    // the logged in user cannot get a notification if they are the one that sent the message
    return messagesArray.filter((message: { sender_email: any; }) => message.sender_email !== this.loggedInUserProfile.email);
  }
}
