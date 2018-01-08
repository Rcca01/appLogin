import { User } from './../../shared/models/user.models';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Chat } from './../../shared/models/chat.models';
import { BaseProvider } from './../base/base.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider extends BaseProvider{

  listChatsObservable:Observable<any[]>;

  constructor(
    public http: Http,
    public afBd:AngularFireDatabase,
    public afAuth:AngularFireAuth
  ) {
    super();
    this.getChatsUserLogged();
    console.log('Hello ChatProvider Provider');
  }

  startChat(chat:Chat, userUid1:string, userUid2:string):Promise<void>{
    return this.afBd.object('/chats/'+userUid1+'/'+userUid2)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  getLastMessage(userLoggedUid:string, userChatUid:string):Observable<{}>{
    return this.afBd.object('/chats/'+userLoggedUid+'/'+userChatUid).valueChanges().catch(this.handleObservableError);
  }

  getChatsUserLogged():void{
    this.afAuth.authState.subscribe((user:User)=>{
      user ? this.getChats(user.uid) : this.listChatsObservable = Observable.of(null);
    });
  }

  private getChats(uidLogged:string):void{
    this.listChatsObservable = this.afBd.list('/chats/'+uidLogged, ref => ref.orderByChild('timestamp'))
    .snapshotChanges()
    .map(changes => {
      return changes.map(c => ({ uid: c.payload.key, ...c.payload.val() })).reverse();
    });
  }

}