import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Locations } from '../../../../../common/index';
import { User } from '../models/user.model';
import { ErrorService } from './error-handler.service';

@Injectable()
export class UsersService extends ErrorService{

  private headers = new Headers({'Content-Type': 'application/json'});
  private baseUrl = environment.restApi.url + Locations.API;

  constructor(private http: Http) {
    super();
  }

  getUsers(): Observable<User[]> {
    return this.http.get( this.baseUrl + Locations.User.GET_ALL )
      .map(response => response.json() as Array<User>)
      .catch(UsersService.handleError);
  }

  getUser(id: number): Observable<User> {
    return this.http.get( this.baseUrl + this.urlConverter( Locations.User.GET_ONE, id) )
      .map(response => response.json() as User)
      .catch(UsersService.handleError);
  }

  create(user: User): Observable<User> {

    return this.http
      .post( this.baseUrl + Locations.User.CREATE , user, {headers: this.headers})
      .map(response => response.json() as User)
      .catch(UsersService.handleError);
  }

  update(id: number, user: User): Observable<User> {
    return this.http
      .put( this.baseUrl + this.urlConverter(Locations.User.UPDATE, id), user, {headers: this.headers})
      .map(response => response.json() as User)
      .catch(UsersService.handleError);
  }

  delete(id: number): Observable<any> {
    return this.http.delete( this.baseUrl + this.urlConverter(Locations.User.DELETE, id ) )
      .map(response => response.json())
      .catch(UsersService.handleError);
  };

  urlConverter( url: string, value: number ): string {
    const result = url.replace( new RegExp(':id'), `${value}` );
    return result;
  }

}
