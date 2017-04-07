import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Locations } from '../../../../../common/index';
import { Position } from '../models/position.model';

@Injectable()
export class PositionsService {

  private baseUrl = environment.restApi.url + Locations.API;

  static handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  constructor(private http: Http) {
  }

  getPositions(): Observable<Position[]> {
    return this.http.get( this.baseUrl + Locations.Position.GET_ALL )
      .map(response => response.json() as Array<Position>)
      .catch(PositionsService.handleError);
  }

}