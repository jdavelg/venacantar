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
import {InputTextareaModule} from 'primeng/inputtextarea';

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
import {CalendarModule} from 'primeng/calendar';
import { CampaignComponent } from './campaign/campaign.component';
import { InputTextModule } from 'primeng/inputtext';
import {ChipsModule} from 'primeng/chips';
import {CardModule} from 'primeng/card';
import {SkeletonModule} from 'primeng/skeleton';
import {ChartModule} from 'primeng/chart';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './banner/banner.component';
import {TabViewModule} from 'primeng/tabview';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ProgressBarModule} from 'primeng/progressbar';
import { StatsComponent } from './stats/stats.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';

const firebaseUiAuthConfig: ExtendedFirebaseUIAuthConfig= {
  signInFlow: 'popup',

  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
 /*    {
      defaultCountry: 'SV',
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID
    }, */


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
    RegisterComponent,
    HeaderComponent,
    BannerComponent,
    StatsComponent,
    
  ],
  imports: [ 
    BrowserAnimationsModule,
    AppRoutingModule,   
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
      CheckboxModule,
      TableModule,
      InputTextModule,
      ConfirmDialogModule,
      DialogModule,
      FileUploadModule,
      ToolbarModule,
      IvyCarouselModule,
      CalendarModule,
      ChartModule,
      ProgressBarModule,
      InputTextareaModule,
      ToastModule,
      ButtonModule,
      ChipsModule,
      CardModule,
      ToggleButtonModule,
      TabViewModule,
      SkeletonModule,
      MultiSelectModule,
      ProgressSpinnerModule,
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
