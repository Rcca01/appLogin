import { CadastroPage } from './../cadastro/cadastro';
import { HomePage } from './../home/home';
import { User } from './../../shared/models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm:FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth:AngularFireAuth,
    private afBd:AngularFireDatabase,
    private formBuilder:FormBuilder) {

      this.loginForm = this.formBuilder.group({
        email:['',[Validators.required]],
        password:['',[Validators.minLength(6)]],
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(){
    try{
      const result = await this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email,this.loginForm.value.password);
      if(result){
        this.navCtrl.setRoot(HomePage);
      }
    }catch(e){
      console.error(e);
    }
  }

  register(){
    this.navCtrl.push(CadastroPage);
  }

  getListaUser():Observable<any[]>{
    return this.afBd.list('users').snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

}
