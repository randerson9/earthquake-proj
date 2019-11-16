import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatCardModule,
         MatButtonModule, MatToolbarModule, MatExpansionModule, MatMenuModule  } from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import { MainTableComponent } from './main-table/main-table.component';
import { DisplayMapComponent } from './display-map/display-map.component';
import { MessageService } from './_services';
import { GetQuakesService } from './_services';

@NgModule({
  declarations: [
    AppComponent,
    MainTableComponent,
    DisplayMapComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatMenuModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule
  ],
  exports: [],
  providers: [MessageService, GetQuakesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
