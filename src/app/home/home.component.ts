import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Singer } from '../models/singer';
import { Campaign } from '../models/campaign';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit, OnDestroy {

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



  selectedCampaigns: Campaign[];

  submitted: boolean;

  statuses: any[];
  constructor(

    private _authService: AuthService,
    private _campaignService: UserService,
    private messageService: MessageService, private confirmationService: ConfirmationService
  ) {

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
    this.getCampaigns()
    this.getSingers()
  }

  onLogout() {

    this._authService.logout()
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe()

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
  onAddVote(singer: any) {
    if (this.userEmail!=undefined && this.userEmail!=null) {
      let voteToPush = {
      singerId: singer.id,
      user: this.userEmail
    }
    let exists:Boolean=false
    if (this.currentCampaign.votes!=undefined && this.currentCampaign.votes!=null) {
       this.currentCampaign.votes.map(voto=>{
      if (voto.user ==this.userEmail) {
        exists=true
      }
    })
    }
   
    if (this.currentCampaign!=undefined &&  exists==false) {
   
      if (!this.currentCampaign.votes) {
        this.currentCampaign['votes']=[voteToPush]
      }else{
         this.currentCampaign.votes.push(voteToPush)
      }
     
      console.log(this.currentCampaign);
      
        this._campaignService.saveVote(this.currentCampaign).subscribe(
      resp=>{
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Voto guardado, puedes volver a votar hasta la proxima semana', life: 1000 });
      },
      err=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al conectarse al servidor, o al guardar el voto' });  
      }
    )
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ya registraste tu voto, espera hasta la siguiente semana' }); 
    }
  

    } else {
      
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor inicia sesion para votar' });
      
    }
    

  }
  getCampaigns() {
    this._campaignService.getCampaings().subscribe(
      resp => {
        this.campaigns = resp

        this.currentCampaign = this.campaigns[this.campaigns.length - 1]
        this.campaigns.map(campana => {
          campana.startDate = new Date(campana.startDate);
          campana.endDate = new Date(campana.endDate)
        })
      },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al conectarse al servidor' });
      }
    )
  }

}
