import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Singer } from '../models/singer';
import { Campaign } from '../models/campaign';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css'],
  providers: [MessageService,ConfirmationService]
})
export class CampaignComponent implements OnInit, OnDestroy {

  singers: Singer[]
  campaigns:Campaign[]
  campaign: Campaign
  isAuthenticated = false
  private userSub: Subscription
  public nominateds: any
  public userEmail: any
  public connectedToB: boolean = true
  clonedCampaigns: { [s: string]: Campaign; } = {};

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
  SignOut() {


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

getCampaigns(){
  this._campaignService.getCampaings().subscribe(
    resp => {
      this.campaigns = resp
this.campaigns.map(campana=>{
  campana.startDate=new Date(campana.startDate);
  campana.endDate=new Date(campana.endDate)
})
    },
    err => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al conectarse al servidor' });
    }
  )
}

  /* new code  */
  openNew() {
    this.campaign = {}
    this.submitted = false;
    this.campaignDialog = true;
  }

  deleteSelectedCampaigns() {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar este departamento?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        for (var i = 0; i < this.selectedCampaigns.length; i++) {
          let cantante = this.selectedCampaigns[i]
          this._campaignService.deleteCampaign(cantante.id).subscribe(
            resp => {
              this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'borrado ' + i + ' de ' + this.selectedCampaigns.length + ' seleccionados', life: 1000 });
            },
            err => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al borrar registro ' + i + ' de ' + this.selectedCampaigns.length + ' seleccionados', life: 1000 });
            }
          )
        }


        this.selectedCampaigns = [];
        this.getCampaigns()
      }
    });
  }

  editCampaign(campaign: Campaign) {
    this.campaign = { ...campaign };
    this.campaignDialog = true;
  }

  deleteCampaign(campaign: any) {
    this.confirmationService.confirm({
      message: 'Estas seguro sobre eliminar ' + campaign.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        /*       this.types = this.types.filter(val => val.id !== type.id); */
        this._campaignService.deleteCampaign(campaign.id).subscribe(
          resp => {
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro borrado satisfactoriamenete', life: 3000 });
            this.getCampaigns()
          },
          err => {
            console.log(err);
            
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al borrar registro ', life: 3000 });
          }
        )
        this.campaign = {};

      }
    });
  }

  hideDialog() {
    this.campaign = {}
    this.campaignDialog = false;
    this.submitted = false;
  }

  saveCampaign() {
    this.submitted = true;
  /*   console.log('campania', this.campaign); */
    
     if (this.campaign.id !== undefined && this.campaign.id != null) {
   
      this._campaignService.updateCampaign(this.campaign).subscribe(
        resp => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro actualizadp', life: 3000 });
          this.hideDialog()
          this.getCampaigns()
        },
        err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en el servidor al guardar el registro', life: 3000 });
        }
      )
    } else {
      this._campaignService.saveCampaign(this.campaign).subscribe(
        resp => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro guardado', life: 3000 });
          this.getCampaigns()
          this.hideDialog()
        },
        err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en el servidor al guardar el registro', life: 3000 });
        }
      )
    } 

    /*    if (this.type.name) {
           if (this.product.id) {
               this.products[this.findIndexById(this.product.id)] = this.product;
               this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
           }
           else {
               this.product.id = this.createId();
               this.product.image = 'product-placeholder.svg';
               this.products.push(this.product);
               this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
           }
   
           this.types = [...this.types];
           this.categoryDialog = false;
           this.type = undefined;
       } */


  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.singers.length; i++) {
      if (this.singers[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  /* end new code */
}
