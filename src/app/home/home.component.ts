import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Singer } from '../models/singer';
import { Campaign } from '../models/campaign';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user';
import { Banner } from '../models/banner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit, OnDestroy {
  public user: any
  singers: Singer[]
  campaigns: Campaign[]
  campaign: Campaign
  isAuthenticated = false
  private userSub: Subscription
  public nominateds: any
  public userEmail: any
  public connectedToB: boolean = true
  clonedCampaigns: { [s: string]: Campaign; } = {};
  currentCampaign: Campaign
  campaignDialog: boolean;
  public isValidEmail: boolean = false
  isAdministrator: boolean = false
  isLoading: boolean = false
  selectedCampaigns: Campaign[];
  banners: any[]
  submitted: boolean;
mainBanners:Array<Banner>=[]
noMainBanners:Array<Banner>=[]
  statuses: any[];

  onRequest: boolean = false
  constructor(

    private _authService: AuthService,
    private _campaignService: UserService,
    private messageService: MessageService, private confirmationService: ConfirmationService
  ) {

    this.userSub = this._authService.user.subscribe(user => {
      this.isAuthenticated = !!user
      if (user != undefined && user != null) {
        this.isAdmin()
        this.user = user
        if (user.email && user.email.startsWith('+')) {
          this.isValidEmail = true
        } else {
          this.isValidEmail = this.verifyEmailValidation(this.user._token);

          /* auto logout si no esta verificado el email start */
                if (this.isValidEmail == false ) {
                console.log(this.isAdministrator);
    
                Swal.fire({
                  title: 'Aviso',
                  text: "Debes verificar tu email para poder votar, revisa en la bandeja de entrada o la carpeta spam el correo que te hemos enviado, luego vuelve a iniciar sesion",
                  icon: 'info',
                  backdrop: `
                  rgba(0, 0, 0, 0.5)               
                  left top
                  no-repeat
                `,
                  showCancelButton: true,
                  cancelButtonText:"Salir",
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Reenviar correo de verificación'
                }).then((result) => {
                  if (result.isConfirmed) {
                    
             this.resendVerificationEmail(this.user._token)
                   
                  }else{
                        this._authService.logout()  
                  }
                })
               
                  
               }  
          /* auto logout si no esta verificado el email fin */
        }

      }

      /* this.getAllVotes(user) */

    })


  }
  ngOnInit(): void {

    this.getBanners()
    this.getCampaigns()
    this.getSingers()
  }

  onLogout() {

    this._authService.logout()
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe()

  }
  resendVerificationEmail(token: any) {
    this._authService.sendEmailVerification(token).subscribe(

      response => {

        Swal.fire({
          icon: 'success',
          title: 'Muy bien',
          text: 'Hemos reenviado el email de confirmacion, despues de verificarlo inicia sesión'

        })

        this._authService.logout()
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          text: 'Ha ocurrido un error de red, espera para volver a solicitar el correo de verificacion'

        })
        this._authService.logout()
      }
    )
  }
  isAdmin() {
    this._campaignService.getPermissions().subscribe(
      resp => {
        if (resp.length >= 1) {
          resp.map(element => {
            if (element.email == this.user.email) {
              this.isAdministrator = true
            }
          })
        }
      }
    )
  }

  getBanners() {
    this._campaignService.getBanners().subscribe(
      response => {


        this.banners = response

if (this.banners.length>=1) {
  
  this.banners.map(banner=>{
    if (banner!=undefined) {
      if (banner.main==true && banner) {
      this.mainBanners.push(banner)
    }else{
      this.noMainBanners.push(banner)
    }
    }
    
  })
}


      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al conectarse al servidor' });

      }
    )
  }
  getSingers() {
    this._campaignService.getSingers().subscribe(
      resp => {
        this.singers = resp

      },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al conectarse al servidor' });
      }
    )
  }

  verifyEmailValidation(token: any) {
    let newToken: any = jwt_decode(token)
    /* console.log('new token', newToken);
    
      console.log('retorno', newToken.email_verified); */

    return newToken.email_verified



  }

  onAddVote(singer: any) {
    /* verify if is request is false */
    if (this.onRequest == false) {

      /* If email is verified continue */
      if (this.isValidEmail != false) {
        this.userEmail = this.user.email
        /*  console.log(this.user);
         console.log(this.isValidEmail); */
        if (this.userEmail != undefined && this.userEmail != null) {
          let voteToPush = {
            singerId: singer.id,
            value: this.userEmail,
            campaignId: this.currentCampaign.id

          }
          /*   let exists:Boolean=false
            if (this.currentCampaign.votes!=undefined && this.currentCampaign.votes!=null) {
               this.currentCampaign.votes.map(voto=>{
              if (voto.user ==this.userEmail) {
                exists=true
              }
            })
            } */

          if (this.currentCampaign != undefined) {

            /* if (!this.currentCampaign.votes) {
              this.currentCampaign['votes']=[voteToPush]
            }else{
               this.currentCampaign.votes.push(voteToPush)
            } */


            this.onRequest = true
            this._campaignService.saveVote(voteToPush, this.user._token).subscribe(
              resp => {
                console.log(resp);

                Swal.fire(
                  'muy bien!',
                  'Haz votado correctamente,recuerda que puedes volver a votar hasta la proxima votacion!',
                  'success'
                )
                this.onRequest = false
              },
              err => {
                console.log(err.error);
                if (err.error && err.error.status && err.error.status == 1001) {
                  Swal.fire(
                    'ERROR!',
                    'Ya votaste. Solamente puedes votar una vez por semana',
                    'error'
                  )
                } else {
                  Swal.fire(
                    'ERROR!',
                    'Ocurrio un error de red! Por favor intenta mas tarde',
                    'error'
                  )
                }
                this.onRequest = false
              }
            )
          } else {
            Swal.fire(
              'ERROR!',
              'Ocurrio un error desconocido! Intenta mas tarde',
              'error'
            )
          }


        } else {

          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor inicia sesion para votar' });

        }
      } else {
        Swal.fire(
          'AVISO!',
          'Debes verificar tu email para poder votar, revisa en la bandeja de entrada o la carpeta spam el correo que te hemos enviado, luego vuelve a iniciar sesion',
          'info'
        )
        this._authService.logout()
      }


    }




  }
  getCampaigns() {
    this._campaignService.getCampaings().subscribe(
      resp => {
        this.campaigns = resp

        this.currentCampaign = this.campaigns[this.campaigns.length - 1]
        this.campaigns.map(campana => {
          /*     campana.startDate = new Date(campana.startDate); */
          campana.endDate = new Date(campana.endDate)
        })
      },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al conectarse al servidor, Intenta mas tarde' });
      }
    )
  }

}
