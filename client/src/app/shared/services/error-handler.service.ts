import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class ErrorService{

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
  return Observable.throw(errMsg);
  }

}