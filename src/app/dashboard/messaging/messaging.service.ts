import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../auth/services/auth.service';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  users = environment.oona + '/api/v1/accounts/z/user/';
  teams = environment.oona + '/api/v1/streams/all';
  subscribedStreams = environment.oona + '/api/v1/streams';
  presentUsers = environment.oona + '/api/v1/accounts/present/user/';
  userProfile = environment.oona + '/api/v1/accounts/profile/';
  streamMessages = environment.oona + '/api/v1/message/s';
  sendStreamMessageURL = environment.oona + '/api/v1/streams/message';
  sendStreamMessageWithFileURL = environment.oona + '/api/v1/streams/file';
  sendIndividualMessageWithFileURL = environment.oona + '/api/v1/message/file';
  individualMessage = environment.oona + '/api/v1/message/';
  streamTopic = environment.oona + '/api/v1/streams/all/topic?stream_id=';
  newTeam = environment.oona + '/api/v1/streams/subscribe';
  newMeeting = environment.oona + '/api/v1/meet/meetings/';
  oonaMemberProfileDetail = environment.oona + '/api/v1/accounts/user/?email=';
  oonaProfileUrl = environment.oona + '/api/v1/accounts/users/';
  streamUnsubscribe = environment.oona + '/api/v1/streams/unsubscribe';
  streamSubscribe = environment.oona + '/api/v1/streams/subscribe';

  allPlatformMembers = [];
  subscribers: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router ) {
    this.getAllUsers();
  }

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

  getAllPlatformUsers(): any {
    return this.http.get(this.users, this.authService.getHeaders());
  }

  getUsersByAvailability(): any {
    return this.http.get(this.presentUsers, this.authService.getHeaders());
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
  goToMemberChat(member: any): void{
    this.router.navigate(['dashboard/messaging/narrow'], { queryParams: { member: member.full_name.replace(/\s/g, '') } });
  }

  getDetailsOfStream(streamId: string): any {
    return this.http.get(this.subscribedStreams, this.authService.getHeaders());
  }
  newListOfUsers(usersPresent: any): any[] {
    const allOnline = usersPresent.filter(
      (user: { presence: { aggregated: { status: string } } }) =>
        user.presence.aggregated.status === 'active'
    );
    // tslint:disable-next-line:max-line-length
    const allOffline = usersPresent.filter(
      (user: { presence: { aggregated: { status: string } } }) =>
        user.presence.aggregated.status === 'offline'
    );
    const allIdle = usersPresent.filter(
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

  sendStreamMessageWithFile(message: any): any{
    return this.http.post(
      this.sendStreamMessageWithFileURL,
      message,
      this.authService.getHeaders()
    );
  }

  sendIndividualMessageWithFile(message: any): any{
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
    return this.http.post(this.newTeam, teamData, this.authService.getHeaders());
  }

  getOonaMemberDetail(email: any): any{
    return this.http.get(this.oonaMemberProfileDetail + email, this.authService.getHeaders());
  }
  oonaProfile(): any{
    return this.http.get(this.oonaProfileUrl, this.authService.getHeaders());
  }
  createMeeting(meetingDetail: any): any{
    return this.http.post(this.newMeeting, meetingDetail, this.authService.getHeaders());
  }

  unsubscribeFromStream(streamDetail: any): any{
    return this.http.post(this.streamUnsubscribe, streamDetail, this.authService.getHeaders());
  }
  subscribeMember(streamDetail: any): any{
    return this.http.post(this.streamSubscribe, streamDetail, this.authService.getHeaders());
  }

  formatDate(dateObject: any): any{
    const cDate = dateObject.getFullYear() + '-' + (dateObject.getMonth() + 1) + '-' + dateObject.getDate();
    const cTime = dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    return cDate + ' ' + cTime;
  }
}
