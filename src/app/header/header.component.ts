import { Component, OnDestroy, OnInit } from '@angular/core';
/* import { AngularFireAuth } from '@angular/fire/auth'; */
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class     HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false
  private userSub: Subscription
  public nominateds: any
  public userEmail: any
  public connectedToB: boolean=true

  constructor(

    private _authService: AuthService,
    private _nominatedService: UserService,

  ) {
/*     this._nominatedService.getNominateds().subscribe(
      response => {

      },
      error => {
        this.connectedToB = false
      }
    ) */
    this.userSub = this._authService.user.subscribe(user => {
      this.isAuthenticated = !!user

      if (user != undefined && user != null) {
        if (user.email) {
          this.userEmail = user.email
        }
      }

    })

    
  }

  ngOnInit(): void {

  }
  onLogout() {

    this._authService.logout()
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe()

  }
  SignOut() {


  }



}