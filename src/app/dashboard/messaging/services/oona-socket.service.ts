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
import {take} from 'rxjs/operators';
import {getSelectedUser} from '../../../auth/state/auth.selectors';

const msgSocket = webSocket(messageChannel);

@Injectable({
  providedIn: 'root'
})
export class OonaSocketService {

  allMessagesCounter = 0;
  allMsgCounterSubject = new BehaviorSubject<number>(this.allMessagesCounter);
  allMsgCounter = this.allMsgCounterSubject.asObservable();

  privateMessagesCounter = 0;
  privateMsgCounterSubject = new BehaviorSubject<number>(this.privateMessagesCounter);
  privateMsgCounter = this.privateMsgCounterSubject.asObservable();

  public recognizedUsers = Array();
  private usersSocket = new BehaviorSubject(this.recognizedUsers);
  currentUsers = this.usersSocket.asObservable();

  newMessages = Array();
  newMessagesUnique = new Set();
  newMessageCount = 0;
  private messageCountSocket = new BehaviorSubject(this.newMessageCount);
  messageCount = this.messageCountSocket.asObservable();

  messagesToStreams = Array();
  private streamMessageCountSocket = new BehaviorSubject(this.messagesToStreams);
  streamMessageSocket = this.streamMessageCountSocket.asObservable();

  messagesInPrivate = Array();
  privateMessageCountSocket = new BehaviorSubject(this.messagesInPrivate);
  privateMessageSocket = this.privateMessageCountSocket.asObservable();

  myMessages = Array();
  myMessagesSocketSubject = new BehaviorSubject(this.myMessages);
  myMessagesSocket = this.myMessagesSocketSubject.asObservable();

  peopleType = Array();
  public typingStatus = Array();
  private typingStatusSocket = new BehaviorSubject(this.recognizedUsers);
  typing = this.typingStatusSocket.asObservable();

  private websocket: WebSocket | undefined;
  private loggedInUserProfile: any;


  constructor(
    private authService: AuthService,
    private messagingService: MessagingService,
    private store: Store<AppState>
  ) {
    this.getCurrentProfile();
    this.connect();
    // this.msgConnect();
    this.updateNotification();
    this.userManagement();
  }

  updateNotification(): void {
    console.log('Updating notifications');
  }

  changeNewMessageCount(newCount: any): void {
    console.log('Message counter ===>>', newCount);
    this.messageCountSocket.next(newCount);
  }
  changeNewStreamMessageCount(newStreamMessages: any): void {
    console.log('newStreamMessages ===>>>', newStreamMessages);
    this.streamMessageCountSocket.next(newStreamMessages);
  }

  changeNewPrivateMessageCount(newPrivateMessages: any): void {
    console.log('changeNewPrivateMessageCount ==>>', newPrivateMessages);
    this.privateMessageCountSocket.next(newPrivateMessages);
  }

  changeTypingStatus(status: any): void {
    console.log('Typing status ==>>', status);
    this.typingStatusSocket.next(status);
  }


  connect(): void {
    /**
     * Creates a websocket connection to the user channel
     */
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';

    const url: string = env.userChannel;
    const userChannel = protocol + url;

    console.log('userChannel URL ===>>>', userChannel);

    this.websocket = new WebSocket(userChannel, this.authService.getToken());
    console.log('Events sockets successfully connected: ', userChannel);
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
    } else if (socketData.message.type === 'message'){
      // console.log('message', socketData);
      this.allMsgCounterSubject.next(this.allMessagesCounter + 1);
      this.setMessageType(socketData);
      // this.newMessages.push(socketData);
      // create a new set unique by message id
      // this.newMessagesUnique = new Set(this.newMessages.map(item => item.message.message.id));
      this.newMessageCount = this.newMessages.length;
      this.changeNewMessageCount(this.newMessageCount);

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
      console.log('Web socket closed');
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

  private setMessageType(socketData: any): void {
    if (socketData.message.message.type === 'stream'){
      this.messagesToStreams.push(socketData.message.message);
      // let the array have unique messages
      // ! below is done because this socket service is called multiple times across multiple components
      // hence a tendency to have it with duplicate items for each time it is called
      // tslint:disable-next-line:max-line-length
      this.messagesToStreams = this.messagesToStreams.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // have unique messages by id
      this.changeNewStreamMessageCount(this.removeLoggedInUserMessages(this.messagesToStreams));
    }else if (socketData.message.message.type === 'private'){
      this.privateMsgCounterSubject.next(this.privateMessagesCounter + 1);

      const currentUserId =  this.loggedInUserProfile?.user_id;
      const msgSenderId = socketData.message?.message?.sender_id;

      if (msgSenderId === currentUserId){
        this.myMessagesSocketSubject.next(socketData.message.message);
      } else {
        this.messagesInPrivate.push(socketData.message.message);
        this.messagesInPrivate = this.messagesInPrivate.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

        console.log('His messages list ===>>>', this.messagesInPrivate);
        this.changeNewPrivateMessageCount(this.removeLoggedInUserMessages(this.messagesInPrivate));
      }
    }

    this.newMessages = this.removeLoggedInUserMessages([...this.messagesToStreams, ...this.messagesInPrivate]);
  }

  private getCurrentProfile(): any {
    this.messagingService.currentUserProfile().subscribe( (profile: any) => {
      this.store.dispatch(new authActions.CurrentUserProfile(profile));
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
