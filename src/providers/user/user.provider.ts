import { Observable } from 'rxjs/Observable';
import { BaseProvider } from './../base/base.provider';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireObject } from 'angularfire2/database/interfaces';


/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider extends BaseProvider {

  constructor(
    public http: Http,
    public afBd:AngularFireDatabase) {
    
      super();
      console.log('Hello UserProvider Provider');
  }

  createUser(user):Promise<void>{
    return this.afBd.object('/users/'+user.uid)
      .set(user)
      .catch(this.handlePromiseError);
  }

  userExists(username: string): Observable<boolean> {
    return this.afBd.list('/users', ref => ref.orderByChild('username').equalTo(username)).valueChanges().map((user) => {
      return user.length > 0;
    }).catch(this.handleObservableError);
  }

  getListaUser():Observable<any[]>{
    return this.afBd.list('users').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
}
