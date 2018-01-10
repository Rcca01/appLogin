import { BoxMessageComponent } from './../components/box-message/box-message';
import { CadastroPage } from './../pages/cadastro/cadastro';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//Imports firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user.provider';
import { BaseProvider } from '../providers/base/base.provider';
import { AuthProvider } from '../providers/auth/auth.provider';
import { ModifyLoggedHeaderComponent } from '../components/modify-logged-header/modify-logged-header';
import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { ChatPage } from '../pages/chat/chat';
import { ChatProvider } from '../providers/chat/chat.provider';
import { MessageProvider } from '../providers/message/message.provider';

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

@NgModule({
  declarations: [
    CapitalizePipe,
    ModifyLoggedHeaderComponent,
    MyApp,
    ChatPage,
    HomePage,
    LoginPage,
    BoxMessageComponent,
    CadastroPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChatPage,
    HomePage,
    LoginPage,
    CadastroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    BaseProvider,
    AuthProvider,
    ChatProvider,
    MessageProvider
  ]
})
export class AppModule {}
