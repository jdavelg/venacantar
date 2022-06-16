import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService:AuthService,
    private primengConfig: PrimeNGConfig
  ){

}

  ngOnInit(): void {
   
    
  this.authService.autologin();
  this.primengConfig.ripple = true;
    
  }
  title = 'venacantar';
 
  
}
