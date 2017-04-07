import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetLocaleComponent } from './set-locale/set-locale.component';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  exports: [SetLocaleComponent],
  declarations: [SetLocaleComponent]
})

export class CoreModule {}
