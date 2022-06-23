import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, EmptyError, Observable } from 'rxjs';
import { User } from '../models/user';
import { global } from '../models/global';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpClient
  ) { }


  getNominateds(): Observable<any> {
    return this._http.get(global.url + 'nominateds')

  }
  login(user: User): Observable<any> {
    /* convertir objeto a json string */
    let params = JSON.stringify(user)
    /* definir cabeceras */

    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    /* devolver peticion http */

    return this._http.post(global.url + 'user/login', params, { headers: headers })
  }

  getVotes(): Observable<any> {

    return this._http.get(global.url + 'votes')
  }
  getVotesNominated(): Observable<any> {

    return this._http.get(global.url + 'nominateds/votes')
  }

  /*   addVote(data: any): Observable<any> {
      let params = JSON.stringify(data)
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
      return this._http.post(global.url + 'votes', params, { headers: headers })
    } */

  uploadImage(image: any): Observable<any> {

    /*     console.log(image); */

    /*   let headers = new HttpHeaders().set('Content-Type', 'multipart/form-data') */


    return this._http.post(global.upload, image/* , { headers: headers } */)
  }
  getSingers(): Observable<any> {
    /* 
        let headers = new HttpHeaders().set('Authorization', this.getToken()) */
    return this._http.get(global.url + 'singers', /* { headers: headers } */)
  }

  getCampaings(): Observable<any> {
    /* 
        let headers = new HttpHeaders().set('Authorization', this.getToken()) */
    return this._http.get(global.url + 'campaigns', /* { headers: headers } */)
  }

  getToken() {
    let token = localStorage.getItem('token')
    if (token != undefined) {
      return token
    } else {
      return '0'
    }

  }


  getBanners(): Observable<any> {
    return this._http.get(global.url + 'banners')
  }
  saveBanner(banner: any): Observable<any> {

 /*    let params = JSON.stringify(banner) */
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    /* .set('Authorization', this._userService.getToken()) */

    return this._http.post(global.url + 'banners/', banner, { headers: headers })

  }

  saveVote(campaign: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')


    return this._http.put(global.url + 'campaigns/' + campaign.id, campaign, { headers: headers })
  }

  getCounter(): Observable<any> {
    return this._http.get(global.url + 'counter/getcounters')
  }

  saveSinger(form: any): Observable<any> {
    /* 
        let headers = new HttpHeaders().set('Authorization', this.getToken()) */
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    let params = form

    return this._http.post(global.url + 'singers', params, { headers: headers })
  }

  saveCampaign(form: any): Observable<any> {
    /* 
        let headers = new HttpHeaders().set('Authorization', this.getToken()) */
    let params = form

    return this._http.post(global.url + 'campaigns', params/* , { headers: headers } */)
  }

  updateSinger(form: any): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    let params: any = form

    return this._http.put(global.url + 'campaigns/' + params.id, params, { headers: headers })
  }

  updateCampaign(form: any): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    let params: any = form

    return this._http.put(global.url + 'campaigns/' + params.id, params, { headers: headers })
  }

  updateBanner(form: any): Observable<any> {

    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    let params: any = form

    return this._http.put(global.url + 'banners/' + params.id, params, { headers: headers })
  }

  deleteBanner(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Authorization', this.getToken())
    return this._http.delete(global.url + 'banners/' + id/* , { headers: headers } */)
  }
  deleteSinger(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Authorization', this.getToken())
    return this._http.delete(global.url + 'singers/' + id/* , { headers: headers } */)
  }
  deleteCampaign(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Authorization', this.getToken())
    return this._http.delete(global.url + 'campaigns/' + id/* , { headers: headers } */)
  }
}
