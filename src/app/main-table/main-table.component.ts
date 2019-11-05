import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../_services';

// The following interface contains all of the relevant data for each earthquake we wish to display in the resulting table.
interface EarthquakeElement {
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

export class MainTableComponent implements OnInit {
  // dataUrl = '../assets/data/testquake.json'; // use this url to test the program from a file without using the node.js backend
  dataUrl = 'http://localhost:3000/api/quakedata';

  EARTHQUAKE_DATA_ALL: EarthquakeElement[] = [];     // holds all earthquake data
  EARTHQUAKE_DATA_OVER4_5: EarthquakeElement[] = [];   // holds all earthquakes magnitude 4.5+
  EARTHQUAKE_DATA_OVER2_5: EarthquakeElement[] = []; // holds all earthquakes magnitude 2.5+
  EARTHQUAKE_DATA_OVER1: EarthquakeElement[] = [];   // holds all earthquakes magnitude 1+

  DATA_CURRENTLY_DISPLAYED: EarthquakeElement[] = [];

  public displayedColumns = ['magnitude', 'latitude', 'longitude', 'area']; // note: the column names MUST be the same as the
  // value names in the EarthquakeElement interface

  public columnsToDisplay: string[] = this.displayedColumns.slice();

  constructor(private http: HttpClient, private messageService: MessageService) { }

  ngOnInit() {
    this.http.get(this.dataUrl).toPromise().then((dataSource: any) => {
        let earthquakeDataArray = []; // This is a temporary array to store earthquake data brought over from the node.js backend
        earthquakeDataArray = dataSource.quakedata.features;

        // Loop through the geoJSON data, which is now stored in earthQuakeDataArray and pull out the relevant features.
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0;  i < earthquakeDataArray.length; i++) {
           const mag = earthquakeDataArray[i].properties.mag; // holds the magnitudes of various earthquakes
           const location = earthquakeDataArray[i].properties.place; // holds the location of a place as a string. E.g: 'South of Panama'
           const long = earthquakeDataArray[i].geometry.coordinates[0]; // longitude of the earthquake
           const lat = earthquakeDataArray[i].geometry.coordinates[1]; // latitude of the earthquake
           const newValue: EarthquakeElement = {magnitude: mag, latitude: lat, longitude: long, area: location};

           this.EARTHQUAKE_DATA_ALL.push(newValue); // always push to this array, as it contains all earthquakes!!

           // We will populate arrays based on the earthquake's magnitude to make it easy to display based on magnitude later on
           if (mag >= 1) {
              this.EARTHQUAKE_DATA_OVER1.push(newValue);
           }
           if (mag >= 2.5) {
              this.EARTHQUAKE_DATA_OVER2_5.push(newValue);
           }
           if (mag >= 4.5) {
              this.EARTHQUAKE_DATA_OVER4_5.push(newValue);
           }

        }

        // Initially, we want to display all earthquakes in our data set (as shown in the line below)
        // Note: we must give DATA_CURRENTLY_DISPLAYED a value or else our table will not know what to display and will be empty
        this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_ALL];
    });
  }

    // this function takes a magnitude value and updates what is displayed in both the map and the table based on that value
      upDateTable(magVal) {
        this.removeAllColumns(); // this function clears the table entirely

        if (magVal === 1) { // if this value is passed, then we want to update the table to display magnitude 1.0+
          this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_OVER1]; // update what is currently displayed
          this.columnsToDisplay = this.displayedColumns.slice();
          this.messageService.notifyOther({magValue: 1}); // with our shared service, we send a message over to
          // display-map.component to update the map
        } else if (magVal === 2.5) {
          this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_OVER2_5];
          this.columnsToDisplay = this.displayedColumns.slice();
          this.messageService.notifyOther({magValue: 2.5}); // with our shared service, we send a message over to
          // display-map.component to update the map
        } else if (magVal === 4.5) {
          this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_OVER4_5];
          this.columnsToDisplay = this.displayedColumns.slice();
          this.messageService.notifyOther({magValue: 4.5}); // with our shared service, we send a message over to
          // display-map.component to update the map
        }
      }

      // This function sorts the table data on magnitude in ascending order
      // It is a simple bubble sort implementation.
      sortOnMagnitudeAsc() {
        const n = this.DATA_CURRENTLY_DISPLAYED.length;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (this.DATA_CURRENTLY_DISPLAYED[j].magnitude > this.DATA_CURRENTLY_DISPLAYED[j + 1].magnitude) {
              // swap the two values
              this.arrSwap(this.DATA_CURRENTLY_DISPLAYED, j, j + 1);
            }
          }
        }

        this.DATA_CURRENTLY_DISPLAYED = [...this.DATA_CURRENTLY_DISPLAYED]; // IMPORTANT: this line is required to display the new changes
      }

      // This function sorts the table data on magnitude in descending order
      // It is a simple bubble sort implementation.
      sortOnMagnitudeDesc() {
        const n = this.DATA_CURRENTLY_DISPLAYED.length;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (this.DATA_CURRENTLY_DISPLAYED[j].magnitude < this.DATA_CURRENTLY_DISPLAYED[j + 1].magnitude) {
              // swap the two values
              this.arrSwap(this.DATA_CURRENTLY_DISPLAYED, j, j + 1);
            }
          }
        }

        this.DATA_CURRENTLY_DISPLAYED = [...this.DATA_CURRENTLY_DISPLAYED]; // IMPORTANT: this line is required to display the new changes
      }

      // The following function takes 3 values: an array name, index 1 and index 2. It swaps the two values
      // in the array.
      arrSwap(arrName, index1, index2) {
        const temp = arrName[index1];
        arrName[index1] = arrName[index2];
        arrName[index2] = temp;
      }

      // the following function reverts our table to what was displayed when the page was first loaded.
      // It removes everything from the table, then updates DATA_CURRENTLY_DISPLAYED to contain the entire dataset.
      refreshTable() { // this function will revert the table to its original display
        this.removeAllColumns();
        this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_ALL];
        this.columnsToDisplay = this.displayedColumns.slice();
        this.messageService.notifyOther({magValue: 'all'});
      }

      // The following is a helper function for refreshTable(). By itself, it simply clears the contents of
      // columnsToDisplay, which will clear the table in its entirety.
      removeAllColumns() {
         // tslint:disable-next-line: prefer-for-of
          while (this.columnsToDisplay.length > 0) {
            this.columnsToDisplay.pop();
          }
      }

}

