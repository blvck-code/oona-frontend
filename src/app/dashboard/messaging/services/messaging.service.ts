import { Injectable } from '@angular/core';
import {
  environment as env,
  messageChannel,
  oonaBaseUrl,
} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AllStreamsModel } from '../models/streams.model';
import { map, take } from 'rxjs/operators';
import { MessagesSocketService } from './messages-socket.service';
import { AllStreamsResponseModel } from '../models/allStreamsResponse.model';
import { Topics, TopicsModel } from '../models/topics.model';
import {getAllMessages, getAllStreams} from '../state/messaging.selectors';
import { SingleMessageModel } from '../models/messages.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import {getAllUsers} from "../../../auth/state/auth.selectors";
import {Title} from "@angular/platform-browser";

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

  private memberDetail = new BehaviorSubject(this.memberObject);
  currentMemberChatDetail = this.memberDetail.asObservable();

  public streamName = '';
  private stream = new BehaviorSubject(this.streamName);
  currentStreamName = this.stream.asObservable();

  public streamTopicDetail = '';
  private topic = new BehaviorSubject(this.streamTopicDetail);
  currentStreamTopic = this.topic.asObservable();

  public textEditorTopic = '';
  private editorTopic = new BehaviorSubject(this.textEditorTopic);
  currentEditorTopic = this.editorTopic.asObservable();

  public memberPmNames = Array();
  private pmNames = new BehaviorSubject(this.memberPmNames);
  currentPmNames = this.pmNames.asObservable();

  public streamMemberNames = Array();
  private names = new BehaviorSubject(this.streamMemberNames);
  currentStreamMemberNames = this.names.asObservable();

  unreadCount = [];
  unreadMessagesSubject = new BehaviorSubject(this.unreadCount);
  unreadMessagesObservable = this.unreadMessagesSubject.asObservable();

  unreadStreams: any[] = [];
  unreadStreamSubject = new BehaviorSubject<any[]>(this.unreadStreams);
  unreadStreamObservable = this.unreadStreamSubject.asObservable();

  streamsUnreadMsgCounter: number = 0;
  streamsUnreadMsgCounterSubject = new BehaviorSubject(this.streamsUnreadMsgCounter);
  streamsUnreadMsgCounterObservable = this.streamsUnreadMsgCounterSubject.asObservable();

  privateUnreadMsgCounter: number = 0;
  privateUnreadMsgCounterSubject = new BehaviorSubject(this.privateUnreadMsgCounter);
  privateUnreadMsgCounterObservable = this.privateUnreadMsgCounterSubject.asObservable();

  totalUnreadMsgCounter: number = 0;
  totalUnreadMsgCounterSubject$ = new BehaviorSubject<number>(this.totalUnreadMsgCounter);
  totalUnreadMsgCounterObservable = this.totalUnreadMsgCounterSubject$.asObservable();

  streamsUnreadMsgArray: any [] = [];
  streamsUnreadMsgArraySubject = new BehaviorSubject(this.streamsUnreadMsgArray);
  streamsUnreadMsgArrayObservable = this.streamsUnreadMsgArraySubject.asObservable();

  privateUnreadMsgArray: SingleMessageModel[] = [];
  privateUnreadMsgArraySubject = new BehaviorSubject<SingleMessageModel[]>(this.privateUnreadMsgArray);
  privateUnreadMsgArrayObservable = this.privateUnreadMsgArraySubject.asObservable();

  totalUnreadMsgArray: any[] = [];
  totalUnreadMsgSubject = new BehaviorSubject(this.totalUnreadMsgArray);
  totalUnreadMsgObservable = this.totalUnreadMsgSubject.asObservable();

  allUnreadMsg: any = [];
  allUnreadMsgSubject = new BehaviorSubject(this.allUnreadMsg);
  allUnreadMsgObserver = this.allUnreadMsgSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private msgSocket: MessagesSocketService,
    private store: Store<AppState>,
    private titleService: Title,
  ) {
    // getting all users
    this.getAllUsers();

    // handle unread messages
    this.handleUnreadMessage();

    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';

    const url: string = env.messageChannel;
    const messageChannelURL = protocol + url;

    this.messages = msgSocket
      .connect(messageChannelURL)
      .map((response: MessageEvent): any => {
        const data = JSON.parse(response.data);
        console.log('Received message ===>>>', data);

        return {
          author: data.author,
          message: data.message,
        };
      }) as Subject<Message>;
  }

  changeMemberDetail(details: any): void {
    this.memberDetail.next(details);
  }

  changeStreamName(name: string): void {
    this.stream.next(name);
  }

  changeTeamTopicMessages(streamTopic: any): void {
    this.topic.next(streamTopic);
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

  getAllUser(): any {
    return this.http.get(env.allUsers);
  }

  getAllPlatformUsers(): any {
    return this.http.get(this.users, this.authService.getHeaders());
  }

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

  getDetailsOfStream(streamId: string): any {
    return this.http.get(this.subscribedStreams, this.authService.getHeaders());
  }

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

  handleUnreadMessage(): any {
    let totalUnreadMessages: number = 0;
    let newArray: any = [];

    const privateMsgArray: SingleMessageModel[] = [];
    const streamMsgArray: SingleMessageModel[] = [];

    // get streams unread messages
    this.store.select(getAllStreams).subscribe(streams => {

      streams?.map((user: any) => {
        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'stream',
              operand: user?.name
            }
          ]
        };

        this.getMessagesOfStream(streamDetail).subscribe(
          (response: any) => {
            // console.log('Getting messages from all users ===>>>', response);
            const messages = response?.zulip?.messages;
            // console.log('stream messages ', messages?.length);

            const res = messages.reduce((x: any, cur: any) => {
              const item = cur.flags.includes('read');
              if (!x[item]) {
                x[item] = 0;
              }
              x[item] = x[item] + 1;
              return x;
            }, {});

            // tslint:disable-next-line:forin
            for (const key in res) {
              const count = res[key];
              const data = key.slice(0, 2);
              const service = key.slice(2);
              this.unreadCount.push({
                // @ts-ignore
                count
              });
            }
            // console.log('The unread count ===>', this.unreadCount[1]);
            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                if (msg.flags.includes('read')) {
                  // console.log('returned');
                } else {
                  // update new stream unread messags
                  const newCount = this.streamsUnreadMsgCounter += 1;
                  this.streamsUnreadMsgCounterSubject.next(newCount);

                  // update new total unread messages
                  // totalUnreadMessages += 1;
                  const newTotal = this.totalUnreadMsgCounter += 1;
                  this.totalUnreadMsgCounterSubject$.next(newTotal);

                  streamMsgArray.push(msg);
                  this.totalUnreadMsgArray.push(msg);
                  this.streamsUnreadMsgArraySubject.next(streamMsgArray)

                }
              }

            });

          }
        );
      });
    });

    // get private unread messages
    this.store.select(getAllUsers).subscribe(users => {
      users?.map((user: any) => {

        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'pm-with',
              operand: user?.email
            }
          ]
        };

        this.getMessagesOfStream(streamDetail).subscribe(
          (response: any) => {
            // console.log('Getting messages from all users ===>>>', response);
            const messages = response?.zulip?.messages;
            // console.log('stream messages ', messages?.length);

            const res = messages.reduce((x: any, cur: any) => {
              const item = cur.flags.includes('read');
              if (!x[item]) {
                x[item] = 0;
              }
              x[item] = x[item] + 1;
              return x;
            }, {});

            // tslint:disable-next-line:forin
            for (const key in res) {
              const count = res[key];
              const data = key.slice(0, 2);
              const service = key.slice(2);
              this.unreadCount.push({
                // @ts-ignore
                count
              });
            }
            // console.log('The unread count ===>', this.unreadCount[1]);
            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                if (msg.flags.includes('read')) {
                  // console.log('returned');
                } else {
                  // update counter for private unread messages
                  const newCount = this.privateUnreadMsgCounter += 1;
                  this.privateUnreadMsgCounterSubject.next(newCount);

                  // update new total unread messages
                  const newTotal = this.totalUnreadMsgCounter += 1;
                  totalUnreadMessages += 1;
                  this.totalUnreadMsgCounterSubject$.next(totalUnreadMessages);

                  privateMsgArray.push(msg)
                  this.privateUnreadMsgArraySubject.next(privateMsgArray)

                  this.totalUnreadMsgSubject.next(newArray);

                }
              }
            });
          }
        );
      })
    })
  }

  handlePrivateUnreadArray(msg: SingleMessageModel): void {
    const newArray: SingleMessageModel[] = [];

    newArray.push(msg)
    this.privateUnreadMsgArraySubject.next(newArray)
  }


  updateReadMessagesFlags(unreadMsgIds: number[]): Observable<any> {
    console.log('Messages to be update ====>>>', unreadMsgIds);

    const messageAfter = unreadMsgIds.map(message => {
      this.streamsUnreadMsgArray.filter(streamMessage => streamMessage.id = message)
    })

    this.streamsUnreadMsgArraySubject.next(messageAfter);

      return this.http.post(
        env.updateMessageFlag,
  {
          messages: unreadMsgIds,
          op: 'add',
          flag: 'read'
        }
      )
  }


}
