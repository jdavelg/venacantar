import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';

const routes: Routes = [
  { path: '',  component: HomeComponent },
  { path: 'acmin',  component: HomeadminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
