import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { UI_DATE_FORMAT } from '../app.constants';

export class NgbDateMomentParserFormatter extends NgbDateParserFormatter {

  constructor(private momentFormat: string) {
    super();
  };

  format(date: NgbDateStruct): string {
    if (date === null) {
      return '';
    }
    let d = moment({year: date.year, month: date.month, date: date.day});
    return d.isValid() ? d.format( UI_DATE_FORMAT ) : '';
  }

  parse(value: string): NgbDateStruct {
    if (!value) {
      return null;
    }
    let d = moment(value,  UI_DATE_FORMAT );
    return d.isValid() ? { year: d.year(),
        month: d.month() ,
        day: d.date() } : null;
  }

}
