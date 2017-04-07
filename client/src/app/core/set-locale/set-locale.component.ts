import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-set-locale',
  templateUrl: './set-locale.component.html'
})

export class SetLocaleComponent {

  constructor(public translate: TranslateService) {

    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('ru');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/ru|en/) ? browserLang : 'ru');

  }
}
