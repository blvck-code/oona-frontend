import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagingComponent } from './messaging.component';
import { TeamMessagingComponent } from './team-messaging/team-messaging.component';
import { TeamMessagingLeftPanelComponent } from './team-messaging/team-messaging-left-panel/team-messaging-left-panel.component';
import { TeamMessagingRightPanelComponent } from './team-messaging/team-messaging-right-panel/team-messaging-right-panel.component';
import { ChatBoardComponent } from './team-messaging/chat-board/chat-board.component';
import { ChatCardComponent } from './team-messaging/chat-board/chat-card/chat-card.component';
import { TextEditorComponent } from './team-messaging/chat-board/text-editor/text-editor.component';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndividualMessagingComponent } from './individual-messaging/individual-messaging.component';
import { IndividualMessagingRightPanelComponent } from './individual-messaging/individual-messaging-right-panel/individual-messaging-right-panel.component';
import { IndividualMessagingBoardComponent } from './individual-messaging/individual-messaging-board/individual-messaging-board.component';
import { IndividualChatCardComponent } from './individual-messaging/individual-messaging-board/individual-chat-card/individual-chat-card.component';
import { IndividualChatCardResponseComponent } from './individual-messaging/individual-messaging-board/individual-chat-card-response/individual-chat-card-response.component';
import { SharedModule } from '../../shared/shared.module';
import { StartPageComponent } from './start-page/start-page.component';
import { LandingMessagingRightPanelComponent } from './start-page/landing-messaging-right-panel/landing-messaging-right-panel.component';
import { LandingMessageBoardComponent } from './start-page/landing-message-board/landing-message-board.component';
import { MessageTimeBtnComponent } from './message-time-btn/message-time-btn.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { LoadingAnimationComponent } from './loading-animation/loading-animation.component';
import { NgxContentfulRichTextModule } from 'ngx-contentful-rich-text';
import { AllPrivateMessagingComponent } from './all-private-messaging/all-private-messaging.component';
import { AllPrivateMessagesBoardComponent } from './all-private-messaging/all-private-messages-board/all-private-messages-board.component';
import { DisplayNamesPipe } from './team-messaging/team-messaging-left-panel/display-names.pipe';
import { AllMentionedMessagesComponent } from './all-mentioned-messages/all-mentioned-messages.component';
import { AllMentionedMessagesBoardComponent } from './all-mentioned-messages/all-mentioned-messages-board/all-mentioned-messages-board.component';
import { CreateTeamComponent } from './team-messaging/create-team/create-team.component';
import { TeamSettingsComponent } from './team-messaging/team-settings/team-settings.component';
import { LeaveTeamComponent } from './team-messaging/team-settings/leave-team/leave-team.component';
import { GroupPmsComponent } from './group-pms/group-pms.component';
import { GroupPmsMessagingBoardComponent } from './group-pms/group-pms-messaging-board/group-pms-messaging-board.component';
import { GroupPmsChatCardComponent } from './group-pms/group-pms-chat-card/group-pms-chat-card.component';
import { ShortenTextPipe } from './group-pms/shorten-text.pipe';
import { GroupPmsTextEditorComponent } from './group-pms/group-pms-text-editor/group-pms-text-editor.component';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { ShowdownModule } from 'ngx-showdown';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { MeetingCardComponent } from './meeting-card/meeting-card.component';
import { TeamMeetingsComponent } from './team-messaging/team-meetings/team-meetings.component';

// NgRx
import { StoreModule } from '@ngrx/store';
import { messagingReducer } from './state/messaging.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MessagingEffects } from './state/messaging.effects';
import { AllMsgTextEditorComponent } from './all-mentioned-messages/all-msg-text-editor/all-msg-text-editor.component';
import { PrivateMsgTextEditorComponent } from './all-private-messaging/private-msg-text-editor/private-msg-text-editor.component';
import { LandingTextEditorComponent } from './start-page/landing-text-editor/landing-text-editor.component';
import { DashboardModule } from '../dashboard.module';
import { EditorComponent } from '../editor/editor.component';
import { StreamsComponent } from './streams/streams.component';
import { StreamsBoardComponent } from './streams/streams-board/streams-board.component';
import { UserFilterPipe } from '../../pipes/user-filter.pipe';
import { AppModule } from '../../app.module';
import { HomeModule } from '../home/home.module';
import { StreamsTextEditorComponent } from './streams/streams-text-editor/streams-text-editor.component';
import { ChannelSettingsComponent } from './team-messaging/channel-settings/channel-settings.component';

@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [
    MessagingComponent,
    TeamMessagingComponent,
    TeamMessagingLeftPanelComponent,
    TeamMessagingRightPanelComponent,
    ChatBoardComponent,
    ChatCardComponent,
    TextEditorComponent,
    IndividualMessagingComponent,
    IndividualMessagingRightPanelComponent,
    IndividualMessagingBoardComponent,
    IndividualChatCardComponent,
    IndividualChatCardResponseComponent,
    StartPageComponent,
    LandingMessagingRightPanelComponent,
    LandingMessageBoardComponent,
    MessageTimeBtnComponent,
    LoadingAnimationComponent,
    AllPrivateMessagingComponent,
    AllPrivateMessagesBoardComponent,
    DisplayNamesPipe,
    AllMentionedMessagesComponent,
    AllMentionedMessagesBoardComponent,
    CreateTeamComponent,
    TeamSettingsComponent,
    LeaveTeamComponent,
    GroupPmsComponent,
    GroupPmsMessagingBoardComponent,
    GroupPmsChatCardComponent,
    ShortenTextPipe,
    GroupPmsTextEditorComponent,
    MeetingCardComponent,
    TeamMeetingsComponent,
    AllMsgTextEditorComponent,
    PrivateMsgTextEditorComponent,
    LandingTextEditorComponent,
    EditorComponent,
    StreamsComponent,
    StreamsBoardComponent,
    UserFilterPipe,
    StreamsTextEditorComponent,
    ChannelSettingsComponent
  ],
  exports: [LoadingAnimationComponent],
  imports: [
    CommonModule,
    MessagingRoutingModule,
    NgxEditorModule,
    NgxEmojiPickerModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RichTextEditorModule,
    NgxContentfulRichTextModule,
    ShowdownModule,
    MarkdownToHtmlModule,
    StoreModule.forFeature('messaging', messagingReducer),
    EffectsModule.forFeature([MessagingEffects]),
    DashboardModule,
    HomeModule,
  ],
})
export class MessagingModule {}
