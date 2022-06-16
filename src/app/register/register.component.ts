import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthResponseData, AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public confirmedPassword: string = ''

  public isLoading = false
  public error: any = null
  public user: User

  constructor(
    private _authService: AuthService,
    private router: Router
  ) {
    this.user = new User('', '')
  }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    this.isLoading = true
    let authObs: Observable<AuthResponseData>
    authObs = this._authService.signup(this.user.email, this.user.password)/* .subscribe(
      response => {
        console.log(response);

        form.reset()
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
        this.router.navigate(['/'])
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage
        this.isLoading = false
      }
    )
  }

}
