import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { messageChannel, userChannel } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import {webSocket, WebSocketSubject} from 'rxjs/internal-compatibility';
import {getToken} from 'codelyzer/angular/styles/cssLexer';

@Injectable({
  providedIn: 'root'
})
export class MessagesSocketService {

  private newMessageCount = 0;
  private connection$: WebSocket | undefined;
  private messageCountSocket = new BehaviorSubject(this.newMessageCount);
  messageCount = this.messageCountSocket.asObservable();

  private messageSocket: WebSocket | undefined;

  constructor(
    private authService: AuthService,
  ) {
    this.messageConnect();
    this.messageCountManagement();
  }

  initSockets(): any {
    this.messageConnect().subscribe(
        (data: any) => {
        console.log('Message content ====>>', data);
      }
    );
  }

  private messageConnect(): any {
    /**
     * Creates a websocket connection to the message channel
     */
    this.messageSocket = new WebSocket(messageChannel, this.authService.getToken());
    console.log('Messaging sockets connected');
  }

  private messageCountManagement(): void {
    // @ts-ignore
    this.messageSocket.onmessage = (evt) => {
      this.filterSocketMessages(evt.data);
      console.log('Message received on the socket =====>>>>', evt);
    };

    // @ts-ignore
    this.messageCountSocket.onclose = (evt) => {
      setTimeout(() => {
        this.messageConnect();
      }, 1000);
    };

    // @ts-ignore
    this.messageCountSocket.onerror = (evt) => {
      setTimeout(() => {
        console.log('Attempting to reconnect messaging sockets ...');
        this.messageConnect();
      }, 1000);
    };
  }

  private filterSocketMessages(data: any): void {
    /*
 * Filters all active and inactive users
 * @param userData Incoming message from the server.
 * @return void
 */
    const socketData  = JSON.parse(data);
    console.log('data', socketData);
    if (socketData){
      if (socketData.message.type === 'message'){
        console.log('pushing message data', socketData);
        this.newMessageCount += 1;
      } else if (socketData.message.type === 'update_message_flags'){
        // how many messages have been read
        const messagesRead = socketData.message.messages.length;
        this.newMessageCount = this.newMessageCount - messagesRead;

      }
    }

  }
}
