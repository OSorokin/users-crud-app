import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';
import { UserDeleteModalComponent } from '../core/modals/user-delete-modal/user-delete-modal.component';
import { UsersRoutingModule } from './users.routing';
import { UsersService } from '../shared/services/users.service';
import { TranslateModule } from 'ng2-translate';
import { AlertModule } from 'ng2-bootstrap';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMomentParserFormatter } from '../shared/date-picker-config';
import { UI_DATE_FORMAT } from '../app.constants';
import { ProjectsService } from '../shared/services/projects.service';
import { PositionsService } from '../shared/services/positions.service';
import { SelectModule } from 'ng2-select';

// определение маршрутов
@NgModule({

  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    TranslateModule,
    SelectModule,
    AlertModule.forRoot(),
    NgbModule.forRoot()
  ],
  declarations: [
    UsersListComponent,
    UserAddEditComponent,
    UserDeleteModalComponent
  ],
  providers: [
    UsersService,
    ProjectsService,
    PositionsService,
    { provide: NgbDateParserFormatter,
      useFactory: () => { return new NgbDateMomentParserFormatter(UI_DATE_FORMAT); }
    }
  ]

})

export class UsersModule {}

