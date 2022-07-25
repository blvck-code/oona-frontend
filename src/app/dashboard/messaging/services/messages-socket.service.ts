import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Observer, Subject} from 'rxjs';
import { environment as env} from '../../../../environments/environment';
import {AuthService} from '../../../auth/services/auth.service';
import {AnonymousSubject} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {MessagingState} from '../state/messaging.reducer';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
// tslint:disable-next-line:import-blacklist
import * as Rx from 'rxjs/Rx';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MessagesSocketService {

  private newMessageCount = 0;
  private connection$: WebSocket | undefined;
  private messageCountSocket = new BehaviorSubject(this.newMessageCount);
  messageCount = this.messageCountSocket.asObservable();
  public messages!: Subject<any>;
  private subject!: AnonymousSubject<MessageEvent>;
  private websocket: WebSocket | undefined;

  constructor(
    private authService: AuthService,
  ) {
    this.messageConnect();
    // this.messageCountManagement();

    // this.messages = <Subject<any>>this.connect(messageChannel).pipe(
    //   map((response: MessageEvent): any => {
    //     console.log('Message response ===>>', response.data);
    //     let data = JSON.parse(response.data);
    //     return data;
    //   })
    // );
  }

  messageConnect(): any {

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';

    const url: string = env.messageChannel;
    const messageChannelURL = protocol + url;

    console.log('userChannel URL ===>>>', messageChannelURL);

    this.websocket = new WebSocket(messageChannelURL, this.authService.getToken());
    console.log('Messages sockets successfully connected: ', messageChannelURL);

  }

  public connect(url: string): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Messages sockets successfully connected: ', url);
    }
    return this.subject;
  }

  private create(url: string): Rx.Subject<MessageEvent> {
    const ws = new WebSocket(url);

    const observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    const observer = {
      next: (data: object) => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log('Sending data ===>>>', JSON.stringify(data));
          ws.send(JSON.stringify(data));
        }
      }
    };

    return Rx.Subject.create(observer, observable);
  }

  messageConnect2(msgUrl: any): AnonymousSubject<MessageEvent> {
    /**
     * Creates a websocket connection to the message channel
     */
    // this.messageSocket = new WebSocket(messageChannel, this.authService.getToken());
    // console.log('message connected');
    if (!this.subject){
      this.subject = this.create(msgUrl);
      console.log('Successfully connected ===>>' + msgUrl);
    }
    return this.subject;
  }


  // messageCountManagement(): void {
  //   // @ts-ignore
  //   this.messageCountSocket.onmessage = (evt) => {
  //     // this.filterSocketMessages(evt.data);
  //     console.log('Message received ====>>>>', evt);
  //   };
  //
  //   // @ts-ignore
  //   this.messageCountSocket.onclose = (evt) => {
  //     setTimeout(() => {
  //       this.messageConnect();
  //     }, 1000);
  //   };
  //
  //   // @ts-ignore
  //   this.messageCountSocket.onerror = (evt) => {
  //     setTimeout(() => {
  //       console.log('Attempting to reconnect messaging sockets ...');
  //       this.messageConnect();
  //     }, 1000);
  //   };
  // }
 //
 //  private filterSocketMessages(data: any): void {
 //    /*
 // * Filters all active and inactive users
 // * @param userData Incoming message from the server.
 // * @return void
 // */
 //    const socketData  = JSON.parse(data);
 //    console.log('data', socketData);
 //    if (socketData){
 //      if (socketData.message.type === 'message'){
 //        console.log('pushing message data', socketData);
 //        this.newMessageCount += 1;
 //      } else if (socketData.message.type === 'update_message_flags'){
 //        // how many messages have been read
 //        const messagesRead = socketData.message.messages.length;
 //        this.newMessageCount = this.newMessageCount - messagesRead;
 //
 //      }
 //    }
 //
 //  }
}
