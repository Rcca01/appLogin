import { AngularFireDatabase } from 'angularfire2/database';
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
import { firebase } from '@firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usersLista:Observable<User[]>;
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
    /*this.authProvider.currentUserObservable
    .first()
    .subscribe((user)=>{
      console.log(user.uid);
      this.usersLista = this.userProvider.getUsersNotLogged(user.uid);
    });*/
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
              dadosUserLogged.subscribe((infouser)=>{
                let timestamp:Object = firebase.database.ServerValue.TIMESTAMP;
                //Chat user logged
                this.chatProvider.startChat(new Chat('',timestamp,infouser[1],''),user.uid,userLogged.uid);
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
}
