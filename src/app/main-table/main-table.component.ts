import {Component} from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface EarthquakeElement {
  magnitude: number;
  latitude: number;
  longitude: number;
  area: string;
}

@Component({
  selector: 'app-main-table',
  styleUrls: ['main-table.component.css'],
  templateUrl: 'main-table.component.html',
})


export class MainTableComponent {
  EARTHQUAKE_DATA: EarthquakeElement[] = [];
  data: EarthquakeElement[] = [];
  dataUrl = '../assets/data/testquake.json';
// private http: HttpClient;
constructor(private http: HttpClient) {

this.http.get(this.dataUrl).toPromise().then((data1: any) => {

       // tslint:disable-next-line: prefer-for-of
       for (let i = 0;  i < data1.features.length; i++) {
           const mag = data1.features[i].properties.mag;
           const location = data1.features[i].properties.place;
           const long = data1.features[i].geometry.coordinates[0];
           const lat = data1.features[i].geometry.coordinates[1];
           const test: EarthquakeElement = {magnitude: mag, latitude: lat, longitude: long, area: location};

           console.log(test);
           console.log(' ');
           this.EARTHQUAKE_DATA.push(test);
           // The following two lines are greatly useful for debugging; they allow us to see what is stored in our
           // interface array.
           // console.log(this.EARTHQUAKE_DATA);
           // console.log(this.EARTHQUAKE_DATA[0]); // => {id: "222", category: "testcat",event_name: "name"}
           this.data = [...this.EARTHQUAKE_DATA];
    }
  });

// tslint:disable-next-line: label-position
// data: EarthquakeElement[] = this.EARTHQUAKE_DATA;

}


       // displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
       public displayedColumns = ['magnitude', 'latitude', 'longitude', 'area']; // note: the column names MUST be the same
                                                                                    // as the value names in the EarthquakeElement interface

       public columnsToDisplay: string[] = this.displayedColumns.slice();

       // data: PeriodicElement[] = ELEMENT_DATA;
      // data: EarthquakeElement[] = [...this.EARTHQUAKE_DATA];

       addColumn() { // adds a random column
          const randomColumn = Math.floor(Math.random() * this.displayedColumns.length);
          this.columnsToDisplay.push(this.displayedColumns[randomColumn]);
       }

       removeColumn() {
        if (this.columnsToDisplay.length) {
          this.columnsToDisplay.pop();
        }
      }

      removeAllColumns() {
         // tslint:disable-next-line: prefer-for-of
          while (this.columnsToDisplay.length > 0) {
            this.columnsToDisplay.pop();
          }
      }

       shuffle() {
    let currentIndex = this.columnsToDisplay.length;
    while (0 !== currentIndex) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap
      const temp = this.columnsToDisplay[currentIndex];
      this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
      this.columnsToDisplay[randomIndex] = temp;
    }
  }
}

