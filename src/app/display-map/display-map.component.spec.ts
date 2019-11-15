import { DisplayMapComponent } from './display-map.component';
import { TestBed, getTestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService, GetQuakesService } from '../_services';
// import { MainTableComponent } from '../main-table/main-table.component';
import { async, ComponentFixture, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import * as L from 'leaflet';

describe('DisplayMapComponent', () => {

  const quake1 = {
    properties: {mag: 1.5},
    geometry: {
      coordinates: [33.0, 22.4]
    }
  };

  const quake2 = {
    properties: {mag: 4.9},
    geometry: {
      coordinates: [63.0, -82.4]
    }
  };
// =======================================
  let acomponent: DisplayMapComponent;
  let afixture: ComponentFixture<DisplayMapComponent>;
  /* let injector: TestBed;
  let tableComponent: MainTableComponent;
  let quakeService: GetQuakesService;
  let messageService: any;
  let container;
  let fixture; */

  beforeEach(
    async(() => {

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DisplayMapComponent],
        providers: [
          DisplayMapComponent,
          MessageService,
          GetQuakesService
        ]
      }).compileComponents();
    }));


  beforeEach(
    async(() => {
// =======================================================
      afixture = TestBed.createComponent(DisplayMapComponent); // error clearning up this boy
      acomponent = afixture.componentInstance;
      afixture.detectChanges();
// =======================================================
      // messageService = TestBed.get(MessageService);
      // injector = getTestBed();
      // fixture  = TestBed.createComponent(DisplayMapComponent);
      // container = fixture.componentInstance; // to access properties and methods


  }));


  it('scaleCircles() should return a radius value, it should return a number', fakeAsync(() => {
    let result = acomponent.scaleCircles(1);
    expect(typeof result).toBe('number');

    result = acomponent.scaleCircles(9);
    expect(result).toBe(250000);
    expect(typeof result).toBe('number');
  }));


  it('when we call setupMap(), we should call updateMap() and createCircle()', () => {
    spyOn(acomponent, 'updateMap').and.callFake(() => null);
    spyOn(acomponent, 'createCircle');

    expect(acomponent).toBeTruthy();
    const dummyData = [];

    dummyData.push(quake1);
    acomponent.setupMap(dummyData);
    expect(acomponent.magnitudesOver1.length).toBe(1); // the value for quake1 should be pushed into the array
    expect(acomponent.createCircle).toHaveBeenCalled();
    expect(acomponent.updateMap).toHaveBeenCalled();
  });


  it('createCircle() should call setColor() and scaleCircles(). Data in newly created circle is validated.', () => {
    spyOn(acomponent, 'setColor');
    spyOn(acomponent, 'scaleCircles').and.callFake(() => 45000);

    const result = acomponent.createCircle([43, -117], 1.1);
    expect(typeof result.options.radius).toBe('number');
    expect(typeof result.options.fillOpacity).toBe('number');
    expect(typeof result.options.color).toBe('string');

    expect(acomponent.scaleCircles).toHaveBeenCalled();
    expect(acomponent.setColor).toHaveBeenCalled();
  });


  it('updateMap() should call clearMap() add layers to map (from whatToDisplay[] array). ', () => {
    spyOn(acomponent, 'clearMap').and.callFake(() => null);

    // generate some dummy circles to add to the map
    const newCircle1 = acomponent.createCircle([22, 45], 1.4);
    const newCircle2 = acomponent.createCircle([43, -25], 4.4);

    // we populate whatToDisplay with the dummy values so that updateMap() has markers to add to the map
    acomponent.whatToDisplay.push(newCircle1);
    acomponent.whatToDisplay.push(newCircle2);

    // call the function of interest :)
    acomponent.updateMap();

    // get the size of myMap._layers
    const output = acomponent.myMap._layers;
    const size = Object.keys(output).length;

    // since we added two markers, we should expect the size to be 4, (2 markers + 2 pieces of metadata)
    expect(size).toBe(4);

    // updateMap() should always call clearMap()
    expect(acomponent.clearMap).toHaveBeenCalled();
  });


  it('clearMap() should remove layers from map. ', () => {
    const newCircle1 = acomponent.createCircle([22, 45], 1.4);
    const newCircle2 = acomponent.createCircle([43, -25], 4.4);

    // we pretend to call updateMap and add two new layers to the map
    spyOn(acomponent, 'updateMap').and.callFake(() => {
      acomponent.allMagnitudes.push(newCircle1);
      acomponent.allMagnitudes.push(newCircle2);
      acomponent.allMagnitudes[0].addTo(acomponent.myMap);
      acomponent.allMagnitudes[1].addTo(acomponent.myMap);
    });

    acomponent.updateMap();
    let output = acomponent.myMap._layers;
    let size = Object.keys(output).length; // get the length of _layers object

    // we should now expect the size to be 4 because we have added two new markers in addition
    // to the (two pieces of) default data
    expect(size).toBe(4);

    // new we call clearMap() which should remove the newly added markers.
    acomponent.clearMap();
    output = acomponent.myMap._layers;
    size = Object.keys(output).length;
    expect(size).toBe(2); // we should be left with just two pieces of metadata regardless of how many markers were added
  });


  /* it('fetchData() should return a promise', async(() => {
    // fetchData() should return a promise

    // the contents of earthquakeDataArray should change (i.e. should be nonzero length)
  }));*/

});
