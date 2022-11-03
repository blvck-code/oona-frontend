import { Injectable } from '@angular/core';
import {
  environment as env,
  oonaBaseUrl,
} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AllStreamsModel } from '../models/streams.model';
import { MessagesSocketService } from './messages-socket.service';
import {
  getAllStreams, getPrivateMessages,
  getStreamMessages, getStreamMsgStatus,
} from '../state/messaging.selectors';
import { SingleMessageModel } from '../models/messages.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import {getZulipUsers} from '../../../auth/state/auth.selectors';
import * as messagingActions from '../state/messaging.actions';

// export interface UnreadMessageModel {
//   stream: string
//   topic: string
//   msgId: number[],
//   counter: number[]
// }

export interface Message {
  author: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  users = env.users;
  teams = env.teams;
  subscribedStreams = env.subscribedStreams;
  presentUsers = env.presentUsers;
  allUsers = env.allUsers;
  userProfile = env.userProfile;
  streamMessages = env.streamMessages;
  sendStreamMessageURL = env.sendStreamMessageURL;
  sendStreamMessageWithFileURL = oonaBaseUrl + '/api/v1/streams/file';
  sendIndividualMessageWithFileURL = env.sendIndividualMessageWithFileURL;
  individualMessage = env.individualMessage;
  streamTopic = env.streamTopic;
  newTeam = env.newTeam;
  newChannel = env.newChannel;
  newMeeting = env.newMeeting;
  oonaMemberProfileDetail = env.oonaMemberProfileDetail;
  oonaProfileUrl = env.oonaProfileUrl;
  streamUnsubscribe = env.streamUnsubscribe;
  streamSubscribe = env.streamSubscribe;

  public memberObject = {
    full_name: undefined,
    bot_type: undefined,
    is_admin: undefined,
    is_active: undefined,
    user_id: undefined,
    is_bot: undefined,
    is_guest: undefined,
    avatar_url: undefined,
    email: undefined,
  };

  allPlatformMembers = [];
  subscribers: any;
  public messages!: Subject<any>;

  messagesId: number[] = [];

  private memberDetail = new BehaviorSubject(this.memberObject);
  currentMemberChatDetail = this.memberDetail.asObservable();

  public streamName = '';
  private stream = new BehaviorSubject(this.streamName);

  public textEditorTopic = '';
  private editorTopic = new BehaviorSubject(this.textEditorTopic);
  currentEditorTopic = this.editorTopic.asObservable();

  public memberPmNames = Array();
  private pmNames = new BehaviorSubject(this.memberPmNames);
  currentPmNames = this.pmNames.asObservable();

  public streamMemberNames = Array();
  private names = new BehaviorSubject(this.streamMemberNames);

  totalUnreadMsgCounter = 0;
  totalUnreadMsgCounterSubject$ = new BehaviorSubject<number>(
    this.totalUnreadMsgCounter
  );

  streamsUnreadMsgArray: any[] = [];
  streamsUnreadMsgArraySubject = new BehaviorSubject(
    this.streamsUnreadMsgArray
  );
  streamsUnreadMsgArrayObservable =
    this.streamsUnreadMsgArraySubject.asObservable();

  privateUnreadMsgArray: SingleMessageModel[] = [];
  privateUnreadMsgArraySubject = new BehaviorSubject<SingleMessageModel[]>(
    this.privateUnreadMsgArray
  );
  privateUnreadMsgArrayObservable =
    this.privateUnreadMsgArraySubject.asObservable();

  totalUnreadMsgArray: any[] = [];
  totalUnreadMsgSubject = new BehaviorSubject(this.totalUnreadMsgArray);
  totalUnreadMsgObservable = this.totalUnreadMsgSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private msgSocket: MessagesSocketService,
    private store: Store<AppState>,
  ) {
    // getting all users
    this.getAllUsers();

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';

    const url: string = env.messageChannel;
    const messageChannelURL = protocol + url;

    this.messages = msgSocket
      .connect(messageChannelURL)
      .map((response: MessageEvent): any => {
        const data = JSON.parse(response.data);
        // console.log('Received message ===>>>', data);

        return {
          author: data.author,
          message: data.message,
        };
      }) as Subject<Message>;
  }


  changeStreamName(name: string): void {
    this.stream.next(name);
  }


  changeEditorTopic(editorTopic: any): void {
    this.editorTopic.next(editorTopic);
  }

  changePmNames(pmNames: any): void {
    this.pmNames.next(pmNames);
  }

  changeCurrentStreamMemberNames(currentNames: any): void {
    this.names.next(currentNames);
  }

  getAllUsers(): any {
    return this.http
      .get(this.users, this.authService.getHeaders())
      .subscribe((subscribers) => {
        // @ts-ignore
        this.allPlatformMembers = subscribers.members;
      });
  }

  // getStreamUnreadMessages(): void {
  //
  //   const streamIds: number[] = [];
  //
  //   this.store.select(getAllStreamData).subscribe(
  //     (messages: SingleMessageModel[]) => {
  //       messages.map((message: SingleMessageModel) => {
  //
  //         if (message.flags.includes('read')){
  //           return;
  //         }
  //
  //         if (streamIds.includes(message.id)){
  //           return;
  //         }
  //
  //         // counting unread steams
  //         const newCount = this.streamsUnreadMsgCounter += 1;
  //         this.streamsUnreadMsgCounterSubject.next(newCount);
  //
  //         // counting total unread messages
  //         // const newTotal = this.totalUnreadMsgCounter += 1;
  //         // this.totalUnreadMsgCounterSubject$.next(newTotal);
  //         streamIds.push(message.id);
  //
  //       });
  //     }
  //   );
  // }

  // getAllUser(): any {
  //   return this.http.get(env.allUsers);
  // }
  //
  // getAllPlatformUsers(): any {
  //   return this.http.get(this.users, this.authService.getHeaders());
  // }

  getUsersByAvailability(): any {
    return this.http.get(this.presentUsers, this.authService.getHeaders());
  }

  getZulipUsers(): Observable<any> {
    return this.http.get(env.zulipUsers);
  }

  getAllTeams(): any {
    return this.http.get(this.teams, this.authService.getHeaders());
  }

  getAllSubscribedStreams(): any {
    return this.http.get(this.subscribedStreams, this.authService.getHeaders());
  }

  currentUserProfile(): any {
    return this.http.get(this.userProfile, this.authService.getHeaders());
  }

  goToMemberChat(member: any): void {
    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: { member: member.full_name.replace(/\s/g, '') },
    });
  }

  // getDetailsOfStream(streamId: string): any {
  //   return this.http.get(this.subscribedStreams, this.authService.getHeaders());
  // }

  newListOfUsers(usersPresent: any): any[] {
    const allOnline = usersPresent?.filter(
      (user: { presence: { aggregated: { status: string } } }) =>
        user.presence.aggregated.status === 'active'
    );
    // tslint:disable-next-line:max-line-length
    const allOffline = usersPresent?.filter(
      (user: { presence: { aggregated: { status: string } } }) =>
        user.presence.aggregated.status === 'offline'
    );
    const allIdle = usersPresent?.filter(
      (user: { presence: { aggregated: { status: string } } }) =>
        user.presence.aggregated.status === 'idle'
    );

    allOnline.sort(this.compare);

    return [
      ...allOnline.sort(this.compare),
      ...allIdle.sort(this.compare),
      ...allOffline.sort(this.compare),
    ];
  }

  compare(member1: any, member2: any): number {
    // * order each list alphanumerically
    if (member1.full_name < member2.full_name) {
      return -1;
    }
    if (member1.full_name > member2.full_name) {
      return 1;
    }
    return 0;
  }

  getMessagesOfStream(streamDetail: any): any {
    return this.http.post(
      this.streamMessages,
      streamDetail,
      this.authService.getHeaders()
    );
  }

  sendStreamMessage(message: any): any {
    return this.http.post(
      this.sendStreamMessageURL,
      message,
      this.authService.getHeaders()
    );
  }

  sendStreamMessageWithFile(message: any): any {
    return this.http.post(
      this.sendStreamMessageWithFileURL,
      message,
      this.authService.getHeaders()
    );
  }

  sendIndividualMessageWithFile(message: any): any {
    return this.http.post(
      this.sendIndividualMessageWithFileURL,
      message,
      this.authService.getHeaders()
    );
  }

  sendIndividualMessage(message: any): any {
    return this.http.post(
      this.individualMessage,
      message,
      this.authService.getHeaders()
    );
  }

  getTopicsOnStreams(streamId: any): any {
    return this.http.get(
      this.streamTopic + streamId,
      this.authService.getHeaders()
    );
  }

  createTeam(teamData: any): any {
    return this.http.post(
      this.newTeam,
      teamData,
      this.authService.getHeaders()
    );
  }

  createChannel(channelData: any): any {
    return this.http.post(
      this.newChannel,
      channelData,
      this.authService.getHeaders()
    );
  }

  getOonaMemberDetail(email: any): any {
    return this.http.get(
      this.oonaMemberProfileDetail + email,
      this.authService.getHeaders()
    );
  }

  oonaProfile(): any {
    return this.http.get(this.oonaProfileUrl, this.authService.getHeaders());
  }

  createMeeting(meetingDetail: any): any {
    return this.http.post(
      this.newMeeting,
      meetingDetail,
      this.authService.getHeaders()
    );
  }

  unsubscribeFromStream(streamDetail: any): any {
    return this.http.post(
      this.streamUnsubscribe,
      streamDetail,
      this.authService.getHeaders()
    );
  }

  subscribeMember(streamDetail: any): any {
    return this.http.post(
      this.streamSubscribe,
      streamDetail,
      this.authService.getHeaders()
    );
  }

  formatDate(dateObject: any): any {
    const cDate =
      dateObject.getFullYear() +
      '-' +
      (dateObject.getMonth() + 1) +
      '-' +
      dateObject.getDate();
    const cTime =
      dateObject.getHours() +
      ':' +
      dateObject.getMinutes() +
      ':' +
      dateObject.getSeconds();
    return cDate + ' ' + cTime;
  }

  fetchAllStreams(): Observable<any> {
    return this.http.get(env.teams);
  }

  fetchSubStreams(): Observable<any> {
    return this.http.get(env.subscribedStreams);
  }

  getStreamTopics(streamId: any): any {
    return this.http.get(this.streamTopic + streamId);
  }

  // counting unread private messages
  handleUnreadPrivateMessages(): void {
    const messageIds: number[] = [];

    this.store.select(getPrivateMessages).subscribe(
      (messages: SingleMessageModel[]) => {
        messages.map((message: SingleMessageModel) => {

          if (messageIds.includes(message.id)){
            return;
          }

          if (message.flags.includes('read')){
            return;
          }

          this.totalUnreadMsgSubject.subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            messages => messages.push(message)
          );

          setTimeout(() => {
            const newTotal2 = this.totalUnreadMsgCounter -= 1;
            this.totalUnreadMsgCounterSubject$.next(newTotal2);
          }, 5000);

          const newTotal = this.totalUnreadMsgCounter += 1;
          this.totalUnreadMsgCounterSubject$.next(newTotal);

          messageIds.push(message.id);
        });
      }
    );
  }

  handleUnreadStreamMessages(): void {
    const messageIds: number[] = [];

    this.store.select(getStreamMessages).subscribe(
      (messages: SingleMessageModel[]) => {
        messages.map((message: SingleMessageModel) => {

          if (messageIds.includes(message.id)){
            return;
          }

          if (message.flags.includes('read')){
            return;
          }

          this.totalUnreadMsgSubject.subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            (messages: any[]) => messages.push(message)
          );

          const newTotal = this.totalUnreadMsgCounter += 1;
          this.totalUnreadMsgCounterSubject$.next(newTotal);

          messageIds.push(message.id);
        });
      }
    );
  }

  handleGetStreamMessages(): void {
    this.store.select(getAllStreams).subscribe(
      (streams: AllStreamsModel[]) => {
        streams?.map((stream: any) => {
          const streamDetail = {
            anchor: 'newest',
            num_before: 30,
            num_after: 0,
            type: [
              {
                operator: 'stream',
                operand: stream?.name,
              },
            ],
          };
          this.store.dispatch(new messagingActions.LoadStreamMessage(streamDetail));
        });
      }
    );
  }

  handleGetPrivateMessages(): void {
    console.log('Getting private message');
    this.store.select(getZulipUsers).subscribe(
      (users: any) => {
        users?.map((user: any) => {

          const streamDetail = {
            anchor: 'newest',
            num_before: 100,
            num_after: 0,
            type: [
              {
                operator: 'pm-with',
                operand: user?.email,
              },
            ],
          };

          this.store.dispatch(new messagingActions.LoadPrivateMessages(streamDetail));

        });
    });
  }

  updateReadMessagesFlags(messageType: string, unreadMsgIds: number[]): Observable<any> {

    this.privateUnreadMsgArrayObservable.subscribe((messages: SingleMessageModel[]) => {

      unreadMsgIds.map((id: number) => {

        const newMessages = messages.filter((message: SingleMessageModel) => message.id !== id);

        console.log(newMessages);

      });

    });


    const request = {
      messages: unreadMsgIds,
      op: 'add',
      flag: 'read',
    };


    return this.http.post(
      env.updateMessageFlag,
      request
    );
  }

  updateMessageFlag(msgId: number): Observable<any> {
    console.log('Updating read status');
    const request = {
      messages: [msgId],
      op: 'add',
      flag: 'read',
    };


    return this.http.post(
      env.updateMessageFlag,
      request
    );
  }

}



