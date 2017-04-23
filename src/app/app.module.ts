import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {LocalStorageModule} from 'angular-2-local-storage';

import { AppComponent } from './app.component';
import { CongeFormulaireComponent } from './conge-formulaire/conge-formulaire.component';

@NgModule({
  declarations: [
    AppComponent,
    CongeFormulaireComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LocalStorageModule.withConfig({
      prefix : 'conge',
      storageType : 'localStorage'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
