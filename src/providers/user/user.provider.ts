import { AuthProvider } from './../auth/auth.provider';
import { Observable } from 'rxjs/Observable';
import { BaseProvider } from './../base/base.provider';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireObject } from 'angularfire2/database/interfaces';
import { User } from '../../shared/models/user.models';


/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider extends BaseProvider {

  listUserObservable:Observable<any>;

  constructor(
    public http: Http,
    public afBd:AngularFireDatabase,
    private afAuth:AuthProvider,
  ) {
    
      super();
      this.listaUsersAuth();
      console.log('Hello UserProvider Provider');
  }

  createUser(user, uid):Promise<void>{
    return this.afBd.object('/users/'+uid)
      .set(user)
      .catch(this.handlePromiseError);
  }

  private getUsersNotLogged(uidToExcluir:string):void{
    this.listUserObservable =  this.afBd.list('users').snapshotChanges().map(changes => {
      return changes.map(c => ({ uid: c.payload.key, ...c.payload.val() })).filter((user)=>user.uid !== uidToExcluir);
    });
  }

  userExists(username: string): Observable<boolean> {
    return this.afBd.list('/users', ref => ref.orderByChild('username').equalTo(username)).valueChanges().map((user) => {
      return user.length > 0;
    }).catch(this.handleObservableError);
  }

  getListaUser():Observable<any[]>{
    return this.afBd.list('users').snapshotChanges().map(changes => {
      return changes.map(c => ({ uid: c.payload.key, ...c.payload.val() }));
    });
  }

  getDadosUser(uid:string):Observable<{}>{
    return this.afBd.object('/users/'+uid).valueChanges().catch(this.handleObservableError);
  }

  private listaUsersAuth(){
    console.log('Nova chamada a lista de users');
    this.afAuth.currentUserObservable.subscribe((user)=>{
      user ? this.getUsersNotLogged(user.uid) : null;
    });
  }

}