import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetLocaleComponent } from './set-locale/set-locale.component';

const routes: Routes = [
  {path: '', component: SetLocaleComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class CoreRoutingModule { }

