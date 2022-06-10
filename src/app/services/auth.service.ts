import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { LoggedUser } from '../models/loggeduser.model';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  user = new BehaviorSubject<LoggedUser>(null)
  private tokenExpirationTimer: any

  constructor(
    public afAuth: AngularFireAuth,
    private _http: HttpClient,
    private router: Router
  ) { }



  signup(email: any, password: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this._http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.ApiKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }, { headers: headers })
      .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        this.sendEmailVerification(resData.idToken).subscribe(
          response => {

          },
          error => {
            console.log(error);

          }
        )

      })
      )

  }

  login(email: any, password: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this._http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.ApiKey, {
      email: email,
      password: password,
      returnSecureToken: true
    },
      { headers: headers })
      .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)

      })
      )
  }
  sendEmailVerification(idToken: any): Observable<any> {
    let body = {}
    body['requestType'] = 'VERIFY_EMAIL'
    body['idToken'] = idToken

    return this._http.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' + environment.ApiKey, body)


  }

  logout() {

    this.user.next(null)
    this.router.navigate(['/login'])
    this.firebaseLogout()
    localStorage.removeItem('userData')
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }
  firebaseLogout() {
    return this.afAuth.signOut().then(() => { })
  }

  autologout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()

    }, expirationDuration)
  }

  autologin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('userData'))

    if (!userData) {
      this.firebaseLogout()
      return;
    }
    const loadedUser = new LoggedUser(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

    if (loadedUser.token) {

      this.user.next(loadedUser)
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
    /*   this.autologout(expirationDuration) */
    }
  }

  handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)


    const user = new LoggedUser(
      email,
      userId,
      token,
      expirationDate
    )

    this.user.next(user)
    localStorage.setItem('userData', JSON.stringify(user))

    /*  this.autologout(expiresIn * 1000) */


  }

  private handleError(errorRes: HttpErrorResponse) {

    let errorMessage = "Un error desconocido ha ocurrido"
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage)
    }

    switch (errorRes.error.error.message) {

      case 'EMAIL_EXISTS': errorMessage = "Ha ocurrido un error, el email ya existe";
        break;

      case 'EMAIL_NOT_FOUND': errorMessage = "Ha ocurrido un error, el email no esta registrado";
        break;

      case 'INVALID_PASSWORD': errorMessage = "Error, email o contraseña incorrecta";
        break;

      case 'WEAK_PASSWORD': errorMessage = "Error, la contraseña debe tener almenos seis caracteres";
        break;
    }
    return throwError(errorMessage)
  }

}
