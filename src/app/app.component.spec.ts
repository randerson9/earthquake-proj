import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DisplayMapComponent } from './display-map/display-map.component';
import { MainTableComponent } from './main-table/main-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatInputModule, MatMenuModule, MatExpansionModule, MatButtonModule, MatTableModule } from '@angular/material';
import { MessageService } from './_services/message.service';
import { GetQuakesService } from './_services/getquakes.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
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
      providers: [
          MainTableComponent,
          DisplayMapComponent,
          MessageService,
          HeaderComponent,
          GetQuakesService
      ],
      declarations: [
        AppComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

    }).compileComponents();
  }));

  fit('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
