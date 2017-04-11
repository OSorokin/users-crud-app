import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Locations } from '../../../../../common/index';
import { Position } from '../models/position.model';
import { ErrorService } from './error-handler.service';

@Injectable()
export class PositionsService extends ErrorService{

  private baseUrl = environment.restApi.url + Locations.API;

  constructor(private http: Http) {
    super();
  }

  getPositions(): Observable<Position[]> {
    return this.http.get( this.baseUrl + Locations.Position.GET_ALL )
      .map(response => response.json() as Array<Position>)
      .catch(PositionsService.handleError);
  }

}