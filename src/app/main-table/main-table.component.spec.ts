import { DisplayMapComponent } from '../display-map/display-map.component';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService, GetQuakesService } from '../_services';
import { async, ComponentFixture } from '@angular/core/testing';
import { MainTableComponent } from './main-table.component';
import { MatTableModule, MatToolbarModule, MatInputModule, MatMenuModule,
         MatExpansionModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { testQuake1, testQuake2, testQuake3, TESTQUAKE1, TESTQUAKE2, TESTQUAKE3 } from './testData';

fdescribe('MainTableComponent', () => {

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
    async () => {
      afixture = TestBed.createComponent(MainTableComponent);
      acomponent = afixture.componentInstance;
      afixture.detectChanges();
  });


  fit('setupTable_InitializeData() should populate the relavent arrays and setup what is to be displayed in the table', () => {
    acomponent.earthquakeDataArray.push(testQuake1);
    acomponent.earthquakeDataArray.push(testQuake2);
    acomponent.earthquakeDataArray.push(testQuake3);

    acomponent.setupTable_InitializeData();

    expect(acomponent.EARTHQUAKE_DATA_ALL.length).toBe(3);
    expect(acomponent.EARTHQUAKE_MAG_BETWEEN0AND1.length).toBe(1);
    expect(acomponent.EARTHQUAKE_MAG_BETWEEN2AND3.length).toBe(1);
    expect(acomponent.EARTHQUAKE_MAG_OVER4.length).toBe(1);

    expect(acomponent.DATA_CURRENTLY_DISPLAYED).toEqual(acomponent.EARTHQUAKE_DATA_ALL);

  });

  fit('upDateTable() --- DATA_CURRENTLY_DISPLAYED should be updated & removeAllColums() should get called', () => {
    spyOn(acomponent, 'removeAllColumns').and.callFake( () => null );
    acomponent.EARTHQUAKE_MAG_BETWEEN2AND3.push(TESTQUAKE1);
    acomponent.EARTHQUAKE_MAG_OVER4.push(TESTQUAKE2);
    acomponent.EARTHQUAKE_MAG_BETWEEN0AND1.push(TESTQUAKE3);

    acomponent.upDateTable('0to1');
    expect(acomponent.removeAllColumns).toHaveBeenCalled();
    expect(acomponent.DATA_CURRENTLY_DISPLAYED).toEqual(acomponent.EARTHQUAKE_MAG_BETWEEN0AND1);

    acomponent.upDateTable('1to2');
    expect(acomponent.removeAllColumns).toHaveBeenCalled();
    expect(acomponent.DATA_CURRENTLY_DISPLAYED).toEqual(acomponent.EARTHQUAKE_MAG_BETWEEN1AND2);

  });

  fit('calling upDateTable() should pass a message using MessageService',
    inject([MessageService], (msgService) => {
      msgService.notifyObservable$.subscribe((message) => {
        expect(message.magValue).toBe('4.0+');
      });

      acomponent.upDateTable('4.0+');
  }));


  fit('removeAllColumns() should result in columnsToDisplay[] having zero length', () => {
    acomponent.removeAllColumns();
    expect(acomponent.columnsToDisplay.length).toBe(0);
  });


  fit('refreshTable() should pass a message to DisplayMapComponent using MessageService',
  inject([MessageService], (msgService) => {
    msgService.notifyObservable$.subscribe((message) => {
      expect(message.magValue).toBe('all');
    });

    acomponent.refreshTable();
  }));

  fit('refreshTable() should call removeAllColumns() and update the value of this.DATA_CURRENTLY_DISPLAYED[]', () => {
    spyOn(acomponent, 'removeAllColumns').and.callFake( () => null );
    acomponent.EARTHQUAKE_DATA_ALL.push(TESTQUAKE1); // give it some inital value for testing

    acomponent.refreshTable();
    expect(acomponent.DATA_CURRENTLY_DISPLAYED).toEqual(acomponent.EARTHQUAKE_DATA_ALL);
    expect(acomponent.removeAllColumns).toHaveBeenCalled();
  });

});
