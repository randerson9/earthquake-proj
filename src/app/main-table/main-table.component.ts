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
  EARTHQUAKE_MAG_OVER4: IEarthquake[] = []; // holds all earthquakes magnitude 4.0+
  EARTHQUAKE_MAG_BETWEEN3AND4: IEarthquake[] = []; // holds all earthquakes magnitude between 3 and 3.999...
  EARTHQUAKE_MAG_BETWEEN2AND3: IEarthquake[] = []; // holds all earthquakes magnitude between 2 and 2.999...
  EARTHQUAKE_MAG_BETWEEN1AND2: IEarthquake[] = []; // holds all earthquakes magnitude between 1 and 1.999...
  EARTHQUAKE_MAG_BETWEEN0AND1: IEarthquake[] = []; // holds all earthquakes magnitude between 0 and .9999...

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

  // This function uses GetQuakesService, which makes an http GET request to
  // fetch earthquake data from the backend
  fetchData() {
    return this._earthquakeService
      .getQuakes()
      .toPromise()
      .then((data: any) => {
        this.earthquakeDataArray = data.quakedata.features;
      });
  }

  // The following function parses the earthquake data retrieved from fetchData() and populates the
  // earthquake data arrays with proper data values. At the end, it sets DATA_CURRENTLY_DISPLAYED[]
  // to EARTHQUAKE_DATA_ALL[], which will initially put all data into the table
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

      // We push everything to this array, as it contains all earthquakes!!
      this.EARTHQUAKE_DATA_ALL.push(newQuake);

      // We will populate arrays based on the earthquake's magnitude to make it easy to display based on magnitude later on
      if (mag >= 0 && mag < 1) {
        this.EARTHQUAKE_MAG_BETWEEN0AND1.push(newQuake);
      }
      if (mag >= 1 && mag < 2) {
        this.EARTHQUAKE_MAG_BETWEEN1AND2.push(newQuake);
      }
      if (mag >= 2 && mag < 3) {
        this.EARTHQUAKE_MAG_BETWEEN2AND3.push(newQuake);
      }
      if (mag >= 3 && mag < 4) {
        this.EARTHQUAKE_MAG_BETWEEN3AND4.push(newQuake);
      }
      if (mag >= 4.0) {
        this.EARTHQUAKE_MAG_OVER4.push(newQuake);
      }
    }

    // Initially, we want to display all earthquakes in our data set (as shown in the line below)
    // Note: we must give DATA_CURRENTLY_DISPLAYED a value or else our table will not know what to display and will be empty
    this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_DATA_ALL];
  }

  // this function takes a magnitude value and updates what is displayed in both the map and the table based on that value
  upDateTable(magVal) {
    this.removeAllColumns(); // this function clears the table entirely

    if (magVal === '0to1') { // if this value is passed, then we want to update the table to display magnitude 1.0+
      this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_MAG_BETWEEN0AND1]; // update what is currently displayed
    } else if (magVal === '1to2') {
      this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_MAG_BETWEEN1AND2]; // update what is currently displayed
    } else if (magVal === '2to3') {
      this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_MAG_BETWEEN2AND3];
    } else if (magVal === '3to4') {
      this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_MAG_BETWEEN3AND4];
    } else if (magVal === '4.0+') {
      this.DATA_CURRENTLY_DISPLAYED = [...this.EARTHQUAKE_MAG_OVER4];
    }

    // with our shared service, we send a message over to DisplayMapComponent to update the map.
    this.messageService.notifyOther({ magValue: magVal });
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

