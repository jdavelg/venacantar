import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { global } from '../models/global';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(
    private authService: AuthService,
    private _http: HttpClient
  ) { }

  exampleGetToken() {
    this.authService.user.pipe(take(1), exhaustMap(user => {
      return this._http.get(global.url)
      /* user.token es para obtener token */
    }))

  }
}
