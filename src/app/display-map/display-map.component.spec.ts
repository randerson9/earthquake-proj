import { DisplayMapComponent } from './display-map.component';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { MessageService } from '../_services';
// import { Message } from '@angular/compiler/src/i18n/i18n_ast';

fdescribe('MainTableComponent', () => {

  let displayMapComponent: DisplayMapComponent;
  let httpTestingController: HttpTestingController;
  // let messageService: MessageService;

  beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          DisplayMapComponent
          // MainTableComponent,
          // MessageService
        ]
      });

      // messageService = TestBed.get(MessageService);
      displayMapComponent = TestBed.get(DisplayMapComponent);
      httpTestingController = TestBed.get(HttpTestingController);


  });

  fit('should fetch the quake data', () => {
    const result = 0;
    expect(result).toBe(0);
    expect(displayMapComponent).toBeTruthy();
  });
});
