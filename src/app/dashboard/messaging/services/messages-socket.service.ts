import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {userChannel, messageChannel} from '../../../../environments/environment';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesSocketService {

  private newMessageCount = 0;
  private messageCountSocket = new BehaviorSubject(this.newMessageCount);
  messageCount = this.messageCountSocket.asObservable();

  private messageSocket: WebSocket | undefined;

  constructor(
    private authService: AuthService,
  ) {
    this.messageConnect();
    this.messageCountManagement();
  }

  messageConnect(): void {
    /**
     * Creates a websocket connection to the message channel
     */
    this.messageSocket = new WebSocket(messageChannel, this.authService.getToken());
    console.log('message connected');
  }

  messageCountManagement(): void {
    // @ts-ignore
    this.messageCountSocket.onmessage = (evt) => {
      // this.filterSocketMessages(evt.data);
      console.log('Message received ====>>>>', evt);
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
        console.log('Attempting to reconnect ...');
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
