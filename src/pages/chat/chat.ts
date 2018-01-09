import { Message } from './../../shared/models/message.models';
import { MessageProvider } from './../../providers/message/message.provider';
import { ChatProvider } from './../../providers/chat/chat.provider';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from './../../providers/auth/auth.provider';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../shared/models/user.models';
import { AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  userLogged:User;
  userChat:User;
  pageTitle:string='chat';
  listMessagesChat:Observable<Message[]>
  listMessagesAngularFireList:AngularFireList<Message>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider:AuthProvider,
    public chatProvider:ChatProvider,
    public messageProvider:MessageProvider
  ) {
  }

  ionViewCanEnter(){
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.userChat = this.navParams.get('infoUser');
    this.pageTitle = this.userChat.nome;
    this.authProvider.currentUserObservable
    .first()
    .subscribe((user)=>{
      this.userLogged = user;

      this.listMessagesAngularFireList = this.messageProvider.getMessagesChatsAngularFireList(this.userLogged.uid, this.userChat.uid);

      this.listMessagesChat = this.messageProvider.getMessagesChats(this.userLogged.uid, this.userChat.uid);
      this.listMessagesChat
      .first()
      .subscribe((messages:Message[])=>{
        if(messages.length === 0){
          this.listMessagesChat = this.messageProvider.getMessagesChats(this.userChat.uid,this.userLogged.uid);
          this.listMessagesAngularFireList = this.messageProvider.getMessagesChatsAngularFireList(this.userChat.uid,this.userLogged.uid);
        }
      });

    });
  }

  sendMessage(newMessage:string):void{
    if(newMessage){
      let timestampAtual:Object = firebase.database.ServerValue.TIMESTAMP;
      this.messageProvider.createMessageChat(
        new Message(this.userChat.uid, newMessage, timestampAtual),
        this.listMessagesAngularFireList
      ).then(()=>{
        this.chatProvider.getRefChat(this.userLogged.uid, this.userChat.uid).update({
          lastMessage:newMessage,
          timestamp:timestampAtual
        });
        this.chatProvider.getRefChat(this.userChat.uid,this.userLogged.uid).update({
          lastMessage:newMessage,
          timestamp:timestampAtual
        });
      });
    }
  }

}
