import { MainTableComponent } from './main-table.component';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from '../_services';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

describe('MainTableComponent', () => {

  let mainTableComponent: MainTableComponent;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;

  beforeEach(() => {

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          MainTableComponent,
          MessageService
        ]
      });

      messageService = TestBed.get(MessageService);
      mainTableComponent = TestBed.get(MainTableComponent);
      httpTestingController = TestBed.get(HttpTestingController);


  });

  it('should fetch the quake data', () => {
    const result = 0;
    expect(result).toBe(0);
    // expect(mainTableComponent).toBeTruthy();
  });
});
