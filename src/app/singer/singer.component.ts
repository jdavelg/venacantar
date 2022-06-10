import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Singer } from '../models/singer';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-singer',
  templateUrl: './singer.component.html',
  styleUrls: ['./singer.component.css'],
  providers: [MessageService,ConfirmationService]

})
export class SingerComponent implements OnInit, OnDestroy {
  singers: Singer[]
  singer: Singer
  isAuthenticated = false
  private userSub: Subscription
  public nominateds: any
  public userEmail: any
  public connectedToB: boolean = true
  clonedSingers: { [s: string]: Singer; } = {};

  singerDialog: boolean;



  selectedSingers: Singer[];

  submitted: boolean;

  statuses: any[];
  constructor(

    private _authService: AuthService,
    private _singerService: UserService,
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
    this._singerService.getSingers().subscribe(
      resp => {
        this.singers = resp

      },
      err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al conectarse al servidor' });
      }
    )
  }
  /* new code  */
  openNew() {
    this.singer = {}
    this.submitted = false;
    this.singerDialog = true;
  }

  deleteSelectedSingers() {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar este departamento?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        for (var i = 0; i < this.selectedSingers.length; i++) {
          let cantante = this.selectedSingers[i]
          this._singerService.deleteSinger(cantante.id).subscribe(
            resp => {
              this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'borrado ' + i + ' de ' + this.selectedSingers.length + ' seleccionados', life: 1000 });
            },
            err => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al borrar registro ' + i + ' de ' + this.selectedSingers.length + ' seleccionados', life: 1000 });
            }
          )
        }


        this.selectedSingers = [];
        this.getSingers()
      }
    });
  }

  editSinger(singer: Singer) {
    this.singer = { ...singer };
    this.singerDialog = true;
  }

  deleteSinger(singer: any) {
    this.confirmationService.confirm({
      message: 'Estas seguro sobre eliminar ' + singer.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        /*       this.types = this.types.filter(val => val.id !== type.id); */
        this._singerService.deleteSinger(singer.id).subscribe(
          resp => {
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro borrado satisfactoriamenete', life: 3000 });
            this.getSingers()
          },
          err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al borrar registro ', life: 3000 });
          }
        )
        this.singer = {};

      }
    });
  }

  hideDialog() {
    this.singer = {}
    this.singerDialog = false;
    this.submitted = false;
  }

  saveSinger() {
    this.submitted = true;
    if (this.singer.id !== undefined && this.singer.id != null) {
    /*   if (this.singer.id) {
        delete this.singer.created_at
      } */
      /* if (this.singer.updated_at) {
        delete this.singer.updated_at
      } */
      this._singerService.updateSinger(this.singer).subscribe(
        resp => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro guardado', life: 3000 });
          this.hideDialog()
          this.getSingers()
        },
        err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en el servidor al guardar el registro', life: 3000 });
        }
      )
    } else {
      this._singerService.saveSinger(this.singer).subscribe(
        resp => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro guardado', life: 3000 });
          this.getSingers()
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
