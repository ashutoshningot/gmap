import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { AgmDirectionModule } from 'agm-direction';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { MapComponentComponent } from './map-component/map-component.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AgmDirectionModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCeVI3RvdgnMGbqnsFsjqlyGjLzxlrzL88',
      libraries: ["places"]
    })
  ],
  declarations: [ AppComponent, HelloComponent, MapComponentComponent ],
  providers: [ GoogleMapsAPIWrapper ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
