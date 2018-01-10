import { ChatProvider } from './../../providers/chat/chat.provider';
import { ChatPage } from './../chat/chat';
import { UserProvider } from './../../providers/user/user.provider';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from './../../providers/auth/auth.provider';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import 'rxjs/add/operator/first';
import { User } from './../../shared/models/user.models';
import { Chat } from '../../shared/models/chat.models';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usersLista:Observable<User[]>;
  chatsLista:Observable<Chat[]>;

  view:string = 'chats';

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public userProvider:UserProvider,
    public chatProvider:ChatProvider
  ) {

  }

  ionViewCanEnter():boolean{
    return this.authProvider.authenticated;
  }

  ionViewDidLoad(){
    this.usersLista = this.userProvider.listUserObservable;
    this.chatsLista = this.chatProvider.listChatsObservable;
  }

  searchList(event:any){
    let search = event.target.value;

    this.usersLista = this.userProvider.listUserObservable;
    this.chatsLista = this.chatProvider.listChatsObservable;

    if(search){
      switch(this.view){
        case 'chats':
          this.chatsLista = <Observable<Chat[]>>this.chatsLista.map((chats:Chat[])=>{
            return chats.filter((chat:Chat)=>{
              return (chat.title.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1);
            });
          });
        break;
        case 'users':
          this.usersLista = <Observable<User[]>>this.usersLista.map((users:User[])=>{
            return users.filter((user:User)=>{
              return (user.nome.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1);
            });
          });
        break; 
      }
    }

  }

  onChatCreate(user:User){
    this.authProvider.currentUserObservable
      .first()
      .subscribe((userLogged)=>{
        this.chatProvider.getLastMessage(userLogged.uid,user.uid)
          .first()
          .subscribe((chat:Chat)=>{
          let dadosUserLogged = this.userProvider.getDadosUser(userLogged.uid);
            if(!chat){
              dadosUserLogged.subscribe((infouser:User)=>{
                let timestamp:Object = firebase.database.ServerValue.TIMESTAMP;
                //Chat user logged
                this.chatProvider.startChat(new Chat('',timestamp,infouser.nome,''),user.uid,userLogged.uid);
                //Chat user send
                this.chatProvider.startChat(new Chat('',timestamp,user.nome,''),userLogged.uid,user.uid);
              });
            }  
          });
      });

    this.navCtrl.push(ChatPage,{
      infoUser:user
    });
  }

  openChat(uidDestinatario:string):void{
    this.userProvider.getDadosUser(uidDestinatario)
    .first()
    .subscribe((user:User)=>{
      user.uid = uidDestinatario;
      this.navCtrl.push(ChatPage,{
        infoUser:user
      });
    })
  }
}
