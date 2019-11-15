import {Component, OnInit} from '@angular/core';
import { MessageService, GetQuakesService } from '../_services';
import { IEarthquake } from '../earthquake';


@Component({
  selector: 'app-main-table',
  styleUrls: ['main-table.component.css'],
  templateUrl: 'main-table.component.html'
})
export class MainTableComponent implements OnInit {
  EARTHQUAKE_DATA_ALL: IEarthquake[] = []; // holds all earthquake data
  EARTHQUAKE_DATA_OVER4_5: IEarthquake[] = []; // holds all earthquakes magnitude 4.5+
  EARTHQUAKE_DATA_OVER2_5: IEarthquake[] = []; // holds all earthquakes magnitude 2.5+
  EARTHQUAKE_DATA_OVER1: IEarthquake[] = []; // holds all earthquakes magnitude 1+
  DATA_CURRENTLY_DISPLAYED: IEarthquake[] = [];
  earthquakeDataArray = new Array(); // This is a temporary array to store earthquake data brought over from the node.js backend

  displayedColumns = ['magnitude', 'latitude', 'longitude', 'area']; // note: the column names MUST be the same as the
  // value names in the EarthquakeElement interface

  columnsToDisplay: string[] = this.displayedColumns.slice();

  constructor(
    private messageService: MessageService,
    // tslint:disable-next-line: variable-name
    private _earthquakeService: GetQuakesService
  ) {}

  ngOnInit() {
    this.fetchData().then(() => {
      this.setupTable_InitializeData();
    });
  }

  fetchData() {
    return this._earthquakeService
      .getQuakes()
      .toPromise()
      .then((data: any) => {
        this.earthquakeDataArray = data.quakedata.features;
      });
  }

  setupTable_InitializeData() {
    // Loop through the geoJSON data, which is now stored in earthQuakeDataArray and pull out the relevant features.
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.earthquakeDataArray.length; i++) {
      const mag = this.earthquakeDataArray[i].properties.mag; // holds the magnitudes of various earthquakes
      const location = this.earthquakeDataArray[i].properties.place; // holds the location as a string. E.g: 'Southern Italy'
      const long = this.earthquakeDataArray[i].geometry.coordinates[0]; // longitude of the earthquake
      const lat = this.earthquakeDataArray[i].geometry.coordinates[1]; // latitude of the earthquake

      // use the earthquake interface to group the data
      const newQuake: IEarthquake = {
        magnitude: mag,
        latitude: lat,
        longitude: long,
        area: location
      };

      this.EARTHQUAKE_DATA_ALL.push(newQuake); // always push to this array, as it contains all earthquakes!!

      // We will populate arrays based on the earthquake's magnitude to make it easy to display based on magnitude later on
      if (mag >= 1) {
        this.EARTHQUAKE_DATA_OVER1.push(newQuake);
      }
      if (mag >= 2.5) {
        this.EARTHQUAKE_DATA_OVER2_5.push(newQuake);
      }
      if (mag >= 4.5) {
        this.EARTHQUAKE_DATA_OVER4_5.push(newQuake);
      }
    }

    // Initially, we want to display all earthquakes in our data set (as shown in the line below)
    // Note: we must give DATA_CURRENTLY_DISPLAYED a value or else our table will not know what to display and will be empty
    this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_ALL];
  }

  // this function takes a magnitude value and updates what is displayed in both the map and the table based on that value
  upDateTable(magVal) {
    this.removeAllColumns(); // this function clears the table entirely

    if (magVal === 1) {
      // if this value is passed, then we want to update the table to display magnitude 1.0+
      this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_OVER1]; // update what is currently displayed
      this.messageService.notifyOther({ magValue: 1 }); // with our shared service, we send a message over to
    } else if (magVal === 2.5) {
      this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_OVER2_5]; // update what is currently displayed
      this.messageService.notifyOther({ magValue: 2.5 }); // with our shared service, we send a message over to
    } else if (magVal === 4.5) {
      this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_OVER4_5];
      this.messageService.notifyOther({ magValue: 4.5 }); // with our shared service, we send a message over to
    }

    this.columnsToDisplay = this.displayedColumns.slice();
  }

  // This function sorts the table data on magnitude in ascending order
  // It is a simple bubble sort implementation.
  sortOnMagnitudeAsc() {
    const n = this.DATA_CURRENTLY_DISPLAYED.length;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (
          this.DATA_CURRENTLY_DISPLAYED[j].magnitude >
          this.DATA_CURRENTLY_DISPLAYED[j + 1].magnitude
        ) {
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
        if (
          this.DATA_CURRENTLY_DISPLAYED[j].magnitude <
          this.DATA_CURRENTLY_DISPLAYED[j + 1].magnitude
        ) {
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
  refreshTable() {
    // this function will revert the table to its original display
    this.removeAllColumns();
    this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_ALL];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.messageService.notifyOther({ magValue: 'all' });
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

