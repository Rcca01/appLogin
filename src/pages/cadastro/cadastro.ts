import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  cadastroForm:FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth:AngularFireAuth,
    private afBd:AngularFireDatabase,
    private loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    private formBuilder:FormBuilder) {

      this.cadastroForm = this.formBuilder.group({
        nome:['',[Validators.required,Validators.minLength(3)]],
        username:['',[Validators.required,Validators.minLength(3)]],
        email:['',[Validators.required]],
        password:['',[Validators.required,Validators.minLength(6)]],
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroPage');
  }

  async register(){    
    let user = this.cadastroForm.value;
    let loading:Loading = this.showLoading();
    try{
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
      if(result){
        delete user.password; //Removendo a senha para não inserir no banco do firebas
        this.afBd.object('/users/'+result['uid']).set(user).then((res)=>{
          this.navCtrl.setRoot(HomePage);
          loading.dismiss();
        }).catch(error =>{
          this.showAlert(error);
        });       
      }
    }catch(e){
      loading.dismiss();
      this.showAlert(e.message);
      console.error(e);
    }
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
}