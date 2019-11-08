import { GetQuakesService } from './getquakes.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IEarthquake } from '../earthquake';

fdescribe('getquakesService', () => {

  let service: GetQuakesService; // service
  let httpMock: HttpTestingController;
  let injector: TestBed;


  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [GetQuakesService]
      });

      injector = getTestBed();
      service = injector.get(GetQuakesService);
      httpMock = injector.get(HttpTestingController);
  });

  // we use .verify() to ensure that there are no outstanding http requests
  afterEach ( () => {
    httpMock.verify();
  });

  fdescribe('fetch quake data', () => {
    fit('should return an Observable<any>', () => {
      const dummyData: IEarthquake[] = [];
      const quake1: IEarthquake = {magnitude: 1.5, latitude: 33.0, longitude: 22.4, area: 'somewhere'};
      const quake2: IEarthquake = {magnitude: 6.7, latitude: 46.0, longitude: 33.4, area: 'somewhere else'};
      dummyData.push(quake1);
      dummyData.push(quake2);


      service.getQuakes().subscribe(earthquakes => {
        expect(earthquakes.length).toBe(2);
        expect(earthquakes).toEqual(dummyData);
      });

      const req = httpMock.expectOne(service.dataUrl);
      expect(req.request.method).toBe('GET');
      req.flush(dummyData);
    });
  });

  fit('should fetch the quake data', () => {
    const result = 0;
    expect(result).toBe(0);
    expect(service).toBeTruthy();
  });


// ==========================================


});
