import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { TranslateService } from 'ng2-translate';
import { UserDeleteModalComponent } from '../../core/modals/user-delete-modal/user-delete-modal.component';

@Component({
  selector: 'app-users-list',
  templateUrl: 'users-list.component.html'
})

export class UsersListComponent implements OnInit {

  users: Array<User>;

  @ViewChild(UserDeleteModalComponent)
  private udmc: UserDeleteModalComponent;

  constructor(
    public userService: UsersService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  editUser(user): void {
    this.router.navigate(['users/edit', user.id]);
  }

  deleteUser(user): void {
    this.userService.delete(user.id).subscribe(() => {
      this.getUsers();
    });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  onUserDelete(user) {
    this.udmc.open().result.then(result => {
      if (result === 'confirmed') {
        this.deleteUser(user);
      }
    }).catch(result => {
    });
  }

}
