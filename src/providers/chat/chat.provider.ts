import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Chat } from './../../shared/models/chat.models';
import { BaseProvider } from './../base/base.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider extends BaseProvider{

  constructor(
    public http: Http,
    public afBd:AngularFireDatabase
  ) {
    super();
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

}
