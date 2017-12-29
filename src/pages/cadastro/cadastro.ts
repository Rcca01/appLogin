import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { HomePage } from '../home/home';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase';

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
    private formBuilder: FormBuilder) {

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
    let loading:Loading = this.showLoading();
    let user = this.cadastroForm.value;
    this.userExists(user.username).subscribe(dados => {
      if (!dados) {
        this.createUser(user).subscribe((result)=>{
          this.showAlert(result['message']);
          if(result['status'] == true){
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
          }
          loading.dismiss();
        });
      }else{
        this.showAlert('Username "'+user.username+'" já está sendo usado!');
        loading.dismiss();
      }
    });
  }

  createUser(user):Observable<[{}]>{
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password).then((userDados)=>{
      delete user.password; //Removendo a senha para não inserir no banco do firebase
      this.afBd.object('/users/'+userDados['uid']).set(user).then((res)=>{
        return {'message':'Usuário cadastrado','status':true};
      }).catch(error =>{
        return {'message':'Erro ao inserir usuário na base de dados','status':false};
      });
    }).catch((error)=>{        
      return {'message':'Erro ao criar usuário',status:false};
    });
  }

  private userExists(username: string): Observable<boolean> {
    return this.afBd.list('/users', ref => ref.orderByChild('username').equalTo(username)).valueChanges().map((user) => {
      return user.length > 0;
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