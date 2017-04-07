import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';

const routes: Routes = [
  {path: 'users', component: UsersListComponent},
  {path: 'users/add', component: UserAddEditComponent},
  {path: 'users/edit/:id', component: UserAddEditComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class UsersRoutingModule { }
