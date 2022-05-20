import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupPmsServiceService {

  constructor() { }

  public chatGroup = [];
  private chat = new BehaviorSubject(this.chatGroup);
  currentChatGroup = this.chat.asObservable();

  changeChatGroup(name: any): void {
    this.chat.next(name);
  }
}
