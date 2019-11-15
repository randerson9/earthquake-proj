import { DisplayMapComponent } from '../display-map/display-map.component';
import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService, GetQuakesService } from '../_services';
import { async, ComponentFixture, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import * as L from 'leaflet';
import { MainTableComponent } from './main-table.component';
import { MatTableModule, MatToolbarModule, MatInputModule, MatMenuModule,
         MatExpansionModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IEarthquake } from '../earthquake';

fdescribe('MainTableComponent', () => {

  const testQuake1 = {
    properties: {
      mag: 2.6,
      place: 'somewhere'
    },
    geometry: {
      coordinates: [33.0, 22.4]
    }
  };

  const testQuake2 = {
    properties: {
      mag: 4.9,
      place: 'somewhere eles'
    },
    geometry: {
      coordinates: [63.0, -82.4]
    }
  };

  const testQuake3 = {
    properties: {
      mag: 0.5,
      place: 'a galaxy far, far away'
    },
    geometry: {
      coordinates: [33.0, 22.4]
    }
  };


  let messageService: MessageService;
  let acomponent: MainTableComponent;
  let afixture: ComponentFixture<MainTableComponent>;


  beforeEach(
    async(() => {

      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          FormsModule,
          BrowserAnimationsModule,
          MatToolbarModule,
          MatInputModule,
          MatMenuModule,
          MatExpansionModule,
          MatButtonModule,
          MatTableModule
        ],
        declarations: [MainTableComponent],
        providers: [
          MainTableComponent,
          DisplayMapComponent,
          MessageService,
          GetQuakesService,
        ]
      }).compileComponents();
    }));


  beforeEach(
    async(() => {
      afixture = TestBed.createComponent(MainTableComponent);
      acomponent = afixture.componentInstance;
      afixture.detectChanges();
  }));

  beforeEach(() => {
      messageService = TestBed.get(MessageService);
  });

  /*   setupTable_InitializeData() {
    for (let i = 0; i < this.earthquakeDataArray.length; i++) {
      const mag = this.earthquakeDataArray[i].properties.mag; // holds the magnitudes of various earthquakes
      const location = this.earthquakeDataArray[i].properties.place; // holds the location as a string. E.g: 'Southern Italy'
      const long = this.earthquakeDataArray[i].geometry.coordinates[0]; // longitude of the earthquake
      const lat = this.earthquakeDataArray[i].geometry.coordinates[1]; // latitude of the earthquake

      const newQuake: IEarthquake = {
        magnitude: mag,
        latitude: lat,
        longitude: long,
        area: location
      };

      this.EARTHQUAKE_DATA_ALL.push(newQuake); // always push to this array, as it contains all earthquakes!!

      if (mag >= 1) {
        this.EARTHQUAKE_DATA_OVER1.push(newQuake);
      }
      if (mag >= 2.5) {
        this.EARTHQUAKE_DATA_OVER2_5.push(newQuake);
      }
      if (mag >= 4.5) {
        this.EARTHQUAKE_DATA_OVER4_5.push(newQuake);
      }
    }

    this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_ALL];
  }*/

  fit('setupTable_InitializeData() should populate the relavent arrays and setup what is to be displayed in the table', () => {
    acomponent.earthquakeDataArray.push(testQuake1);
    acomponent.earthquakeDataArray.push(testQuake2);
    acomponent.earthquakeDataArray.push(testQuake3);

    acomponent.setupTable_InitializeData();

    expect(acomponent.EARTHQUAKE_DATA_ALL.length).toBe(3);
    expect(acomponent.EARTHQUAKE_DATA_OVER1.length).toBe(2);
    expect(acomponent.EARTHQUAKE_DATA_OVER2_5.length).toBe(2);
    expect(acomponent.EARTHQUAKE_DATA_OVER4_5.length).toBe(1);

    expect(acomponent.DATA_CURRENTLY_DISPLAYED).toEqual(acomponent.EARTHQUAKE_DATA_ALL);

  });
});
