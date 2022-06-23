import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { Banner } from '../models/banner';
import { global } from '../models/global';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  selectedFile: File | any;
  banner:Banner
  status:any
  banners:any

  clonedBanners: { [s: string]: Banner; } = {};

  bannerDialog: boolean;



  selectedBanners: Banner[];

  submitted: boolean;

  statuses: any[];
  constructor(    
    private _bannerService:UserService,
    private messageService: MessageService,
     private confirmationService: ConfirmationService
    ) {
  
   }

  ngOnInit(): void {
  this.getBanners()
  }

  onSubmit(banner?: any) {


    let fd = new FormData();

    fd.append('thumbnail', this.selectedFile, this.selectedFile.name)



    this._bannerService.uploadImage(fd).subscribe(
      response => {
        if (response.path) {
          console.log(response.path);
          let firstPath = response.path

          let pathtoadd = firstPath.split("https://clips-vod-tcs.s3.amazonaws.com/")
          let definitelypath = global.toReplace + pathtoadd[1]
          console.log(definitelypath);

          this.banner.image = definitelypath
          /* start banner */
          this._bannerService.saveBanner(this.banner).subscribe(
            response => {
              if (response) {
                console.log(response);
                
                this.status = 'success'
               
                this.getBanners()
               this.hideDialog()
                Swal.fire(
                  'muy bien!',
                  'El banner se ha guardado!',
                  'success'
                )

              }
            },

            error => {
              console.log(error);
              this.status = "error"
              Swal.fire(
                'lo sentimos!',
                'Hubo un error al intentar guardar el banner!',
                'error'
              )

            }
          )

        }

      },
      error => {
        Swal.fire(
          'Error!',
          'El registro no se ha guardado.',
          'error'
        )
      }
    )





  }

  getBanners() {
    this._bannerService.getBanners().subscribe(
      response => {

      
          this.banners = response
          console.log(this.banners);
          
         
     
      },
      error => {
        console.log(error);

      }
    )
  }
  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0]
    console.log(this.selectedFile);

  }


   /* new code  */
   openNew() {
    this.banner = {}
    this.submitted = false;
    this.bannerDialog = true;
  }

  deleteSelectedBanners() {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar este departamento?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        for (var i = 0; i < this.selectedBanners.length; i++) {
          let banner = this.selectedBanners[i]
          this._bannerService.deleteBanner(banner.id).subscribe(
            resp => {
              this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'borrado ' + i + ' de ' + this.selectedBanners.length + ' seleccionados', life: 1000 });
            },
            err => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al borrar registro ' + i + ' de ' + this.selectedBanners.length + ' seleccionados', life: 1000 });
            }
          )
        }


        this.selectedBanners = [];
        this.getBanners()
      }
    });
  }

  editBanner(banner: Banner) {
    this.banner = { ...banner };
    this.bannerDialog = true;
  }

  deleteBanner(banner: any) {
    this.confirmationService.confirm({
      message: 'Estas seguro sobre eliminar ' + banner.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        /*       this.types = this.types.filter(val => val.id !== type.id); */
        this._bannerService.deleteBanner(banner.id).subscribe(
          resp => {
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro borrado satisfactoriamenete', life: 3000 });
            this.getBanners()
          },
          err => {
            console.log(err);
            
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al borrar registro ', life: 3000 });
          }
        )
        this.banner = {};

      }
    });
  }

  hideDialog() {
    this.banner = {}
    this.bannerDialog = false;
    this.submitted = false;
  }

  saveBanner() {
    this.submitted = true;
  /*   console.log('campania', this.banner); */
    
     if (this.banner.id !== undefined && this.banner.id != null) {
   
      this._bannerService.updateBanner(this.banner).subscribe(
        resp => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro actualizado', life: 3000 });
          this.hideDialog()
          this.getBanners()
        },
        err => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en el servidor al guardar el registro', life: 3000 });
        }
      )
    } else {
      this._bannerService.saveBanner(this.banner).subscribe(
        resp => {
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Registro guardado', life: 3000 });
          this.getBanners()
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
    for (let i = 0; i < this.banners.length; i++) {
      if (this.banners[i].id === id) {
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
