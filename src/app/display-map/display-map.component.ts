import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService, GetQuakesService } from '../_services';
import * as L from 'leaflet';


@Component({
  selector: 'app-display-map',
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.css']
})
export class DisplayMapComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  myMap: any;
  legend = L.control({ position: 'bottomright' }); // set the position of our legend


  // define feature groups for earthquakes with different magnitudes.
  allMagnitudes = new Array(); // holds markers for all earthquake data
  magnitudesOver4 = new Array(); // holds markers for over 4.0 magnitude
  magnitudes3to4 = new Array(); // holds markers magnitudes 3.0 to 3.999...
  magnitudes2to3 = new Array(); // holds markers for magnitudes 2.0 to 2.999...
  magnitudes1to2 = new Array();
  magnitudes0to1 = new Array();

  earthquakeDataArray = new Array(); // holds earthquake data during iniitial setup
  whatToDisplay = new Array();       // holds whatever markers are to be currently displayed

  // Next, we set the bounds of the map.
  southWest = L.latLng(-150, -250);
  northEast = L.latLng(110, 250);
  myBounds = L.latLngBounds(this.southWest, this.northEast);
  startingCoordinates = [39.585, -103.46]; // the map will initally be centered on these coordinates
  startingZoom = 5;

  constructor(
    private messageService: MessageService,
    // tslint:disable-next-line: variable-name
    private _earthquakeService: GetQuakesService
  ) {}

  ngOnInit() {
    // the following line centers the map on a given set of coordinates, and sets the initial zoom level
    // the setView() function takes two arguments, an array of coordinates and a zoom level.
    this.myMap = L.map('map').setView(
      this.startingCoordinates,
      this.startingZoom
    );

    // add a tile layer to the map, set the bounds, set the maximum and minimum zoom
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 8,
      minZoom: 2,
      bounds: this.myBounds,
      noWrap: true
    }).addTo(this.myMap);

    // this function makes the map "bounce back" if the user goes beyond the bounds of the map
    this.myMap.setMaxBounds(this.myBounds);

    // This will draw the legend onto the map
    this.setupLegend();

    // Fetch the data, wait until the http GET request completes, then call setupMap and listenForChanges()
    // Without waiting for fetchData() to complete, we could end up with errors!!
    this.fetchData().then(() => {
      this.setupMap(this.earthquakeDataArray);
      this.listenForChanges();
    });

  }


  // the following subscription is used to receive messages passed from main-table.component.ts
  // This is accomplished via a shared service (message.service.ts). We update which group of markers
  // are to be displayed. We simply update the whatToDisplay array to whichever group of circles correspond
  // to the magnitude value passed, then we call updateMap() to make the changes take effect
  listenForChanges() {
    this.subscription = this.messageService.notifyObservable$.subscribe(
      receivedMessage => {
        if (receivedMessage.magValue === '4.0+' ) {
          this.whatToDisplay = this.magnitudesOver4;
        } else if (receivedMessage.magValue === '3to4') {
          this.whatToDisplay = this.magnitudes3to4;
        } else if (receivedMessage.magValue === '2to3') {
          this.whatToDisplay = this.magnitudes2to3;
        } else if (receivedMessage.magValue === '1to2') {
          this.whatToDisplay = this.magnitudes1to2;
        } else if (receivedMessage.magValue === '0to1') {
          this.whatToDisplay = this.magnitudes0to1;
        } else if (receivedMessage.magValue === 'all') {
          this.whatToDisplay = this.allMagnitudes;
        }

        this.updateMap(); // call updateMap() to change the display based on the changes we just made to whatToDisplay[]
      }
    );
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


  // The following function:
  // 1.) parses the raw data retrieved from fetchData(),
  // 2.) creates circle markers for each earthquake by calling createCircle(),
  // 3.) groups the markers into arrays based on the earthquake's magnitude,
  // 4.) calls updateMap() to add the newly created markers to the map
  setupMap(quakeDataArray) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < quakeDataArray.length; i++) {
      const mag = quakeDataArray[i].properties.mag; // temporary variable to store the magnitude
      const coords = []; // temporary variable to store the earthquake's coordinates
      coords[0] = quakeDataArray[i].geometry.coordinates[1]; // stores the latitude of the quake
      coords[1] = quakeDataArray[i].geometry.coordinates[0]; // stores the longitude of the quake

      //  The line below creates a new circle marker. It gives it a color, radius, ..etc.
      const newCircle = this.createCircle(coords, mag);

      // we push every single circle marker (regardless of magnitude) to allMagnitudes[]
      this.allMagnitudes.push(newCircle);

      // if the magnitude is between 0 and .999..., push to the following array
      if (mag >= 0 && mag < 1) {
        this.magnitudes0to1.push(newCircle);
      } else if (mag >= 1 && mag < 2) {        // if the magnitude is between 1 and 1.999..., push to the following array
        this.magnitudes1to2.push(newCircle);
      } else if (mag >= 2 && mag < 3) {         // if the magnitude is between 2 and 2.999..., push to the following array
        this.magnitudes2to3.push(newCircle);
      } else if (mag >= 3 && mag < 4) {         // if the magnitude is between 3 and 3.999..., push to the following array
        this.magnitudes3to4.push(newCircle);
      } else if (mag >= 4.0) {
        this.magnitudesOver4.push(newCircle);
      }
    }

    // we initially want to display all earthquakes
    this.whatToDisplay = this.allMagnitudes;
    this.updateMap();
  }

  // The following function draws a legend onto the map
  setupLegend() {
    this.legend.onAdd = map => {

      // tslint:disable-next-line: one-variable-per-declaration
      const div = L.DomUtil.create('div', 'info legend');
      const mags = [0, 1, 2, 3, 4];
      const labels = [];

      for (let i = 0; i < mags.length; i++) {
        const from = mags[i];
        const to = mags[i + 1];

        labels.push(
          '<i style="background:' + this.setColor(from) + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    this.legend.addTo(this.myMap);
  }


  // the following funcion loops through the array holding all possible markers and removes them from the map
  clearMap() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.allMagnitudes.length; i++) {
      this.myMap.removeLayer(this.allMagnitudes[i]);
    }
  }


  createCircle(coords, mag) {
    const newCircle = L.circle(coords, {
      color: '#545453',
      fillColor: this.setColor(mag),
      fillOpacity: 0.6,
      radius: this.scaleCircles(mag)
    });

    return newCircle;
  }


  // the following function clears the map by calling clearMap(), then loops through whatever array of markers
  // is currently displayed in whatToDisplay[]. It adds them to the map one at a time.
  updateMap() {
    this.clearMap();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.whatToDisplay.length; i++) {
      this.whatToDisplay[i].addTo(this.myMap);
    }
  }


  // we choose the size of the earthquake based on the magnitude
  // this function returns an integer that corresponds to the radius of the circle marker
  scaleCircles(magnitude) {
    if (magnitude >= 0 && magnitude < 1) {
      return 15000;
    } else if (magnitude >= 1 && magnitude < 2) {
      return 30000;
    } else if (magnitude >= 2 && magnitude < 3) {
      return 60000;
    } else if (magnitude >= 3 && magnitude < 4) {
      return 125000;
    } else if (magnitude >= 4.0) {
      return 250000;
    }
  }


  // we choose the color for the earthquake marker based on the magnitude value
  // this function simply returns a Hexadecimal RGB value
  setColor(magnitude) {
    if (magnitude >= 0 && magnitude < 1) {
      return '#bab8b3';
    } else if (magnitude >= 1 && magnitude < 2) {
      return '#FED976';
    } else if (magnitude >= 2 && magnitude < 3) {
      return '#ff7b2e';
    } else if (magnitude >= 3 && magnitude < 4) {
      return '#E31A1C';
    } else if (magnitude >= 4.0) {
      return '#800026';
    }
  }


  // It is a good idea to unsubscribe to prevent any memory leaks
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
