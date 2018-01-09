import { Message } from './../../shared/models/message.models';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireList } from 'angularfire2/database';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {

  constructor(
    public http: Http,
    public afBd:AngularFireDatabase
  ) {
    console.log('Hello MessageProvider Provider');
  }

  createMessageChat(message:Message, listMessages:AngularFireList<Message>):Promise<void>{
    return Promise.resolve(listMessages.push(message));
  }

  getMessagesChats(uidUser1:string, uidUser2:string):Observable<Message[]>{
    return this.afBd.list('/messages/'+uidUser1+'-'+uidUser2, ref => ref.orderByChild('timestamp'))
    .snapshotChanges()
    .map(changes => {
      return changes.map(c => ({ uid: c.payload.key, ...c.payload.val() }));
    });
  }

  getMessagesChatsAngularFireList(uidUser1:string, uidUser2:string):AngularFireList<Message>{
    return this.afBd.list('/messages/'+uidUser1+'-'+uidUser2, ref => ref.orderByChild('timestamp'));
  }

}