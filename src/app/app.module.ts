import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExtendedFirebaseUIAuthConfig, firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular-i18n';
/* import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular'; */
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import {CheckboxModule} from 'primeng/checkbox';
import { environment } from 'src/environments/environment.prod';
import { SafePipe } from './safe.pipe';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { SingerComponent } from './singer/singer.component';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import {ToastModule} from 'primeng/toast';
import {MultiSelectModule} from 'primeng/multiselect';
import {ButtonModule} from 'primeng/button';
import { CampaignComponent } from './campaign/campaign.component';
const firebaseUiAuthConfig: ExtendedFirebaseUIAuthConfig= {
  signInFlow: 'popup',

  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      defaultCountry: 'SV',
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID
    },


  ],
  
  tosUrl: 'http://comprometidos.fundaciontcs.com/',
  privacyPolicyUrl: 'http://comprometidos.fundaciontcs.com/',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
  language: 'es'
};
@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    LoginComponent,
    HomeComponent,
    HomeadminComponent,
    SingerComponent,
    CampaignComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
      CheckboxModule,
      TableModule,
      ConfirmDialogModule,
      DialogModule,
      FileUploadModule,
      ToolbarModule,
      ToastModule,
      ButtonModule,
      MultiSelectModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [
    { provide: USE_AUTH_EMULATOR, useValue: !environment.production ? ['localhost', 4200] : /* 'http://comprometidos.fundaciontcs.com/' */ undefined },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
