import { AuthProvider } from './../../providers/auth/auth.provider';
import { CadastroPage } from './../cadastro/cadastro';
import { HomePage } from './../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
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
  user:UserAuth;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth:AngularFireAuth,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    private afBd:AngularFireDatabase,
    private formBuilder:FormBuilder,
    private authProvider:AuthProvider) {

      this.loginForm = this.formBuilder.group({
        email:['',[Validators.required]],
        password:['',[Validators.required, Validators.minLength(6)]],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    let loading:Loading = this.showLoading();
    this.authProvider.signIn(this.loginForm.value.email,this.loginForm.value.password).then((user)=>{
      this.user = user;
      this.navCtrl.setRoot(HomePage);
      loading.dismiss();
    }).catch((error:any)=>{
      console.log(error);
      loading.dismiss();
      this.showAlert(error);
    })
  }

  register(){
    this.navCtrl.push(CadastroPage);
  }

  private showLoading():Loading{
    let loading:Loading = this.loadingCtrl.create({
      content:"Please wait...",
    });
    loading.present();
    return loading;
  }

  private showAlert(message:string):void{
    this.alertCtrl.create({
      message:message,
      buttons:['OK']
    }).present();
  }

  onHome(){
    this.navCtrl.push(HomePage);
  }
}
