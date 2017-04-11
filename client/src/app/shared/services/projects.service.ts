import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Locations } from '../../../../../common/index';
import { Project } from '../models/project.model';
import { ErrorService } from './error-handler.service';

@Injectable()
export class ProjectsService extends ErrorService{

  private baseUrl = environment.restApi.url + Locations.API;

  constructor(private http: Http) {
    super();
  }

  getProjects(): Observable<Project[]> {
    return this.http.get( this.baseUrl + Locations.Project.GET_ALL )
      .map(response => response.json() as Array<Project>)
      .catch(ProjectsService.handleError);
  }

}