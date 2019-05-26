import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { StoreManagerModule } from 'ngrx-store-manager';
import { AppConfig } from './app.config';

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([]), StoreManagerModule.forRoot(AppConfig)],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService]
})
export class AppModule { }