import {Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject } from 'rxjs';

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
  dataUrl = '../assets/data/testquake.json';
  // private messageSource = new BehaviorSubject<string>('default message');
  // currentMessage = this.messageSource.asObservable();

  EARTHQUAKE_DATA_ALL: EarthquakeElement[] = [];     // holds all earthquake data
  EARTHQUAKE_DATA_OVER4_5: EarthquakeElement[] = [];   // holds all earthquakes magnitude 4.5+
  EARTHQUAKE_DATA_OVER2_5: EarthquakeElement[] = []; // holds all earthquakes magnitude 2.5+
  EARTHQUAKE_DATA_OVER1: EarthquakeElement[] = [];   // holds all earthquakes magnitude 1+

  data: EarthquakeElement[] = [];

constructor(private http: HttpClient) {
this.http.get(this.dataUrl).toPromise().then((dataSource: any) => {

       // tslint:disable-next-line: prefer-for-of
       for (let i = 0;  i < dataSource.features.length; i++) {
           const mag = dataSource.features[i].properties.mag;
           const location = dataSource.features[i].properties.place;
           const long = dataSource.features[i].geometry.coordinates[0];
           const lat = dataSource.features[i].geometry.coordinates[1];
           const newValue: EarthquakeElement = {magnitude: mag, latitude: lat, longitude: long, area: location};

          // console.log(newValue); // Note: this line is here strictly for debugging. It can be removed without consequence.
          // console.log(' ');      // Note: this line is here strictly for debugging. It can be removed without consequence.
           this.EARTHQUAKE_DATA_ALL.push(newValue); // always push to this array, as it contains all earthquakes!!

           if (mag >= 1) {
              this.EARTHQUAKE_DATA_OVER1.push(newValue);
           }
           if (mag >= 2.5) {
              this.EARTHQUAKE_DATA_OVER2_5.push(newValue);
           }
           if (mag >= 4.5) {
              this.EARTHQUAKE_DATA_OVER4_5.push(newValue);
           }

           // console.log(this.EARTHQUAKE_DATA); // Note: this line is here strictly for debugging. It can be removed without consequence.
           // console.log(this.EARTHQUAKE_DATA[0]); Note: this line is here strictly for debugging. It can be removed without consequence.
           this.data = [...this.EARTHQUAKE_DATA_ALL];
    }
  });

}

       public displayedColumns = ['magnitude', 'latitude', 'longitude', 'area']; // note: the column names MUST be the same as the
                                                                                 // value names in the EarthquakeElement interface

       public columnsToDisplay: string[] = this.displayedColumns.slice();


      upDateTable(magVal) {
        this.removeAllColumns();

        if (magVal === 1) {
          this.data = [...this.EARTHQUAKE_DATA_OVER1];
          this.columnsToDisplay = this.displayedColumns.slice();
        } else if (magVal === 2.5) {
          // alert('upDateTable() called'); // Note: this line is strictly for debugging and can be removed later
          this.data = [...this.EARTHQUAKE_DATA_OVER2_5];
          this.columnsToDisplay = this.displayedColumns.slice();
        } else if (magVal === 4.5) {
          this.data = [...this.EARTHQUAKE_DATA_OVER4_5];
          this.columnsToDisplay = this.displayedColumns.slice();
        }
      }

      sortOnMagnitude() {
        // write function to sort data on magnitude
        alert('sortOnMagnitude() called. This function is still in development!');
      }

      refreshTable() { // this function will revert the table to its original display
        this.removeAllColumns();
        this.data = [...this.EARTHQUAKE_DATA_ALL];
        this.columnsToDisplay = this.displayedColumns.slice();
      }

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
         // alert('removeAllColumns() called');
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

