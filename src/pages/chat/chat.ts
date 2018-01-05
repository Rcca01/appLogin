import { AuthProvider } from './../../providers/auth/auth.provider';
import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../shared/models/user.models';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  userLogged:User;
  userChat:User;
  pageTitle:string='chat';

  messages:string[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider:AuthProvider
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
    });
    console.log('ionViewDidLoad ChatPage');
  }

  sendMessage(newMessage:string):void{
    this.messages.push(newMessage);
  }

}
