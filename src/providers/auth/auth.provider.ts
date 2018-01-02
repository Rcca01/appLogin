import { BaseProvider } from './../base/base.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider extends BaseProvider {

  constructor(
    public http: Http,
    private afAuth:AngularFireAuth) {
      super();
    console.log('Hello AuthProvider Provider');
  }

  signIn(email,password){
    return this.afAuth.auth.signInWithEmailAndPassword(email,password)
      .catch(this.handlePromiseError);
  }

  createAuthUser(email,password){
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password)
      .catch(this.handlePromiseError);
  }

}
