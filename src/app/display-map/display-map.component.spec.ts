import { DisplayMapComponent } from './display-map.component';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DisplayMapComponent', () => {

  let mapComponent: DisplayMapComponent; // service
  let httpMock: HttpTestingController;
  let injector: TestBed;
  // let messageService: MessageService;

  beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          DisplayMapComponent
        ]
      });

      // messageService = TestBed.get(MessageService);
      injector = getTestBed();
      mapComponent = injector.get(DisplayMapComponent);
      httpMock = injector.get(HttpTestingController);


  });

  it('should fetch the quake data', () => {
    const result = 0;
    expect(result).toBe(0);
    expect(mapComponent).toBeTruthy();
  });


// ==========================================


});
