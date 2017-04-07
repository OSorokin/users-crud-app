import * as moment from 'moment';

export class BaseMapper {
  static formatDate(date: Date, format: string): string {
    if (date == null) {
      return null;
    }
    return moment(date).format(format);
  }

  static parseDate(date: string, format: string): Date {
    if (date == null) {
      return null;
    }
    return moment(date, format).toDate();
  }

}