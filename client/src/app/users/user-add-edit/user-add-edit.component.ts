import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { ProjectsService } from '../../shared/services/projects.service';
import { PositionsService } from '../../shared/services/positions.service';
import { TranslateService } from 'ng2-translate';
import { isSuccess } from '@angular/http/src/http_utils';
import { User } from '../../shared/models/user.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { EnumValues } from 'enum-values';
import { EMAIL_REGEXP, UI_DATE_FORMAT, BIRTH_DATE } from '../../app.constants';
import * as moment from 'moment';
import { Project } from '../../shared/models/project.model';
import { Position } from '../../shared/models/position.model';
import { Gender } from '../../shared/models/gender.enum';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: 'user-add-edit.component.html'
})

export class UserAddEditComponent implements OnInit {

  id: number;
  user = new User();

  projects : Array<Project>;
  positions: Array<Position>;

  genders = EnumValues.getValues( Gender );

  userBirthDate: string;

  isSuccessSaveUser = false;
  isErrorSaveUser = false;

  isNew: boolean;

  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    public userService: UsersService,
    public projectService: ProjectsService,
    public positionService: PositionsService,
    private translate: TranslateService) {

    this.form = fb.group({

      'name': new FormControl('', Validators.required ),
      'surname': new FormControl('', Validators.required ),
      'birth_date': new FormControl('', [
        Validators.required,
        this.userBirthDateValidator
      ]),
      'gender': new FormControl('', Validators.required, ),
      'email': new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGEXP)
      ]),
      'position': new FormControl('', Validators.required, ),
      'project': new FormControl('', Validators.required, )

    });
    console.log('constr done');
  }
  
  ngOnInit(){
    this.projectService.getProjects().subscribe( pt => this.projects = pt );
    this.positionService.getPositions().subscribe( ps => this.positions = ps );
    this.checkUserData();
  }
  
  checkUserData(){
      this.route.params.subscribe((params: Params) => {
        const userId = params['id'];
        this.isNew = userId === undefined;
        this.getUserByIdIfExist(userId);
      });
  }

  getUserByIdIfExist(userId: number): void {
    if (!this.isNew) {
      this.userService.getUser(userId).subscribe(
        user => {
          this.id = user.id;
          this.user = user;
          this.form.patchValue(user);
          this.form.patchValue({position:user.position.id});
          this.form.patchValue({project:user.project.id});
          this.form.patchValue({birth_date: this.convertDateToJsonNgbDateStruct(user.birth_date)});
      });
    }
  }

  onSaveUser(): void {

    if (this.isNew ) {

      const newUser = new User(this.form.value);
      newUser.birth_date = this.userBirthDate;

      newUser.position = this.setUserPosition(this.form.get('position').value);
      newUser.project = this.setUserProject(this.form.get('project').value);

      console.log(newUser);

      this.userService.create(newUser).subscribe(res => {
        this.isSuccessSaveUser = !isSuccess(res.id);
        this.isErrorSaveUser = isSuccess(res.id);
      });

    } else {

      const user = new User(this.form.value);
      user.id = this.id;
      user.position = this.setUserPosition(this.form.get('position').value);
      user.project = this.setUserProject(this.form.get('project').value);
      user.birth_date = this.userBirthDate;
      console.log(user);

      this.userService.update(this.id, user).subscribe(
        (res) => {
          this.isSuccessSaveUser = !isSuccess(res.id);
          this.isErrorSaveUser  = isSuccess(res.id);
        }
      );

    }

  }

  userBirthDateValidator(control: FormControl): {[s: string]: any} {
    const isObject = control.value instanceof Object;
    const regex = new RegExp(BIRTH_DATE);
    if ( isObject  ) {
      const dt = control.value.day + '/' + control.value.month + '/' + control.value.year;
      if (!regex.test(dt)) {
        return {'birth_date': true};
      }
    }

    if ( !isObject ) {
      if (!regex.test(control.value)) {
        return {'birth_date': true};
      }
    }

    return null;

  }

  onSelectDate( date: NgbDateStruct ): void {
    if (date !== null) {
      const d = moment({ year: date.year, month: date.month, day: date.day });
      this.userBirthDate = d.format( UI_DATE_FORMAT );
    }
  }

  convertDateToJsonNgbDateStruct ( date: string ): NgbDateStruct {
    const d = moment( date, UI_DATE_FORMAT );
    return { year: d.year(), month: d.month(), day: d.date() };
  }

  onValCh(obj: any){
    console.log(this.form.value);
  }

  setUserPosition( posId: any ): Position {
    return this.positions.filter(
      position => position.id == +posId)[0];
  }

  setUserProject( ptId: any ): Project {
    return this.projects.filter(
      project => project.id == +ptId)[0];
  }

}
