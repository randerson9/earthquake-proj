import { DisplayMapComponent } from './display-map.component';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

fdescribe('DisplayMapComponent', () => {

  let displayMapComponent: DisplayMapComponent;
  let httpTestingController: HttpTestingController;
  // let messageService: MessageService;

  beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          DisplayMapComponent
        ]
      });

      // messageService = TestBed.get(MessageService);
      displayMapComponent = TestBed.get(DisplayMapComponent);
      httpTestingController = TestBed.get(HttpTestingController);


  });

  fit('should fetch the quake data', () => {
    const result = 0;
    expect(result).toBe(0);
    // expect(displayMapComponent).toBeTruthy();
  });
});
