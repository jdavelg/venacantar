import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular-i18n';
import { Observable, of, Subscription } from 'rxjs';
import { User } from '../models/user';
import { AuthResponseData, AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public user: User
  public error: any = null
  public isLoading = false
  /*  public FB: any; */
  toastr: any;
  loginSuscriber: Subscription

  constructor(
    private _authService: AuthService,
    private router: Router,
    public angularFireAuth: AngularFireAuth,
    private ngZone: NgZone
  ) {
    this.user = new User('', '')


  }

  ngOnInit(): void {


  }
  onSubmit(form: any) {
    this.isLoading = true
    let authObs: Observable<AuthResponseData>
    authObs = this._authService.login(this.user.email, this.user.password)/* .subscribe(

      response => {
        console.log(response);
        this.isLoading = false

      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage
        this.isLoading = false
      }
    ) */
    authObs.subscribe(
      response => {
        this.isLoading = false
        form.reset()
        this.router.navigate([''])
      },
      errorMessage => {
        this.error = errorMessage
        this.isLoading = false
      }
    )

  }

  listenChangesonLogin() {
    /*     this.loginSuscriber = this.angularFireAuth.authState.subscribe(response => {
    
          if (response) {
            console.log('logueado');
    
            var token;
            let uid: any = response.uid
            var cellPhone = response.phoneNumber
    
            if (cellPhone) {
    
    
    
              response.getIdToken().then(respons => {
                token = respons
                console.log(token);
    
    
    
                let expTime = (+new Date(response.metadata.lastSignInTime).getTime() / 100) + 3600283;
    
                if (token != undefined) {
                  console.log('to handle auth from phone');
    
                  this._authService.handleAuthentication(cellPhone, uid, token, expTime)
             
                }
    
              })
    
    
    
            } else {
    
              console.log('no logueado');
    
              response.getIdToken().then(respons => {
                token = respons
    
                let expTime = (+new Date(response.metadata.lastSignInTime).getTime() / 100) + 3600283;
    
                if (token != undefined) {
                  this._authService.handleAuthentication(response.email, uid, token, expTime)
            
    
    
    
                }
    
              })
    
    
    
    
    
    
    
            }
          }
        },
        );
     */



  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    /*   let token: any = signInSuccessData.authResult.user.getIdToken()
     let decodified= jwt_decode(token)
     console.log(decodified); */
    var token;
    var uid: any = signInSuccessData.authResult.user.uid
    if (signInSuccessData.authResult.additionalUserInfo.providerId == 'phone') {

      var cellPhone = signInSuccessData.authResult.user.phoneNumber

      signInSuccessData.authResult.user.getIdToken().then(result => {
        token = result

        var expTime = (+new Date(signInSuccessData.authResult.user.metadata.lastSignInTime).getTime() / 100) + 3600283;

        if (token != undefined) {



          this._authService.handleAuthentication(cellPhone, uid, token, expTime)
          this.ngZone.run(() => this.router.navigateByUrl('/')).then();
        }

      });


    } else {

      signInSuccessData.authResult.user.getIdToken().then(result => {
        token = result

        var expTime = (+new Date(signInSuccessData.authResult.user.metadata.lastSignInTime).getTime() / 100) + 7600283;

        if (token != undefined) {
          this._authService.handleAuthentication(signInSuccessData.authResult.user.email, uid, token, +expTime)
          this.ngZone.run(() => this.router.navigateByUrl('/')).then();
        }

      });
    }





  }
 /*  googleSignIn(email: any, userId: any, credentials: any, expiration: any) {
    console.log(credentials);
    console.log(expiration);


    if (credentials.stsTokenManager.accessToken && expiration.stsTokenManager.expirationTime) {
      this._authService.handleAuthentication(email, userId, credentials.stsTokenManager.accessToken, expiration.stsTokenManager.expirationTime)
    }

  } */

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log(errorData);

  }

  uiShownCallback() {

  }
  ngOnDestroy(): void {
    /* this.loginSuscriber.unsubscribe() */

  }


}
