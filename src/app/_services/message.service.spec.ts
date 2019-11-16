import {TestBed, inject} from '@angular/core/testing';
import {MessageService} from './message.service';
import { MainTableComponent } from '../main-table/main-table.component';
import { DisplayMapComponent } from '../display-map/display-map.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GetQuakesService } from './getquakes.service';


fdescribe('MessageService', () => {

  // let msgService: MessageService;
  let tableComponent: MainTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService, MainTableComponent, DisplayMapComponent, GetQuakesService],
      imports: [HttpClientTestingModule]
    });

    tableComponent = TestBed.get(MainTableComponent);

  });

  it('__calling upDateTable() in MainTableComponent should change notifyObservable',
    inject([MessageService], (msgService, done) => {
      msgService.notifyObservable$.subscribe((message) => {
        expect(message.magValue).toBe(4.5);
      });

      tableComponent.upDateTable(4.5);

  }));


  it('call .notifyOther() should emit data to notifyObservable$',
    inject([MessageService], (msgService) => {
      msgService.notifyObservable$.subscribe((message) => {
        expect(message).toBe('test');
      });

      msgService.notifyOther('test');

  }));
});
