import { LoginPage } from './../login/login';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { HomePage } from '../home/home';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthProvider } from './../../providers/auth/auth.provider';
import { UserProvider } from './../../providers/user/user.provider';


import 'rxjs/add/operator/first';

/**
 * Generated class for the CadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})

export class CadastroPage {

  cadastroForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private afBd: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private userProvider:UserProvider,
    private authProvier:AuthProvider) {

    this.cadastroForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroPage');
  }

  register() {
    let user = this.cadastroForm.value;
    let loading =  this.showLoading();
    this.userProvider.userExists(user.username)
    .first()
    .subscribe((userExists:Boolean)=>{
      if(!userExists){
        this.authProvier.createAuthUser(user.email,user.password).then((authState:any)=>{
          delete user.password;
          user.uid = authState.uid;
          this.userProvider.createUser(user).then(()=>{
            this.showAlert('Registro efetuado');
            this.navCtrl.setRoot(LoginPage);
            loading.dismiss();
          }).catch((error:any)=>{
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });
        }).catch((error:any)=>{
          console.log(error);
          loading.dismiss();
          this.showAlert(error);
        });
      }else{
        this.showAlert('O username '+user.username+' Já está sendo usado');
        loading.dismiss();
      }
    });
  }

  

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    }).present();
  }
}