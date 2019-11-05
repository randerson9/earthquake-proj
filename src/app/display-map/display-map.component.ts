import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MessageService } from '../_services';

// Add the routing code to draw the route using the plugin. This is done in the line below:
import '../../../node_modules/loader-runner/leaflet-routing-machine/dist/leaflet-routing-machine.js';

declare let L;

@Component({
  selector: 'app-display-map',
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.css']
})

export class DisplayMapComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  myMap: any;
  dataUrl = 'http://localhost:3000/api/quakedata'; // this url is used to fetch JSON data from the node.js backend
  // dataUrl = '../assets/data/testquake.json'; // this url is there for testing purposes only, it can be used to get data from
                                                // a static file without a node.js backend.

  // define feature groups for earthquakes with different magnitudes.
  allMagnitudes = new Array();   // holds markers for all earthquake data
  magnitudesOver4_5 = new Array();   // holds markers for over 4.5 magnitude
  magnitudesOver2_5 = new Array(); // holds markers for over 4.5 magnitude
  magnitudesOver1 = new Array(); // holds markers for over 4.5 magnitude
  whatToDisplay = this.allMagnitudes;

  constructor(private http: HttpClient, private messageService: MessageService) {  }

  ngOnInit() {

    // the following line centers the map on a given set of coordinates, and sets the initial zoom level
    // the setView() function takes two arguments, an array of coordinates and a zoom level.
    this.myMap = L.map('map').setView([39.585, -103.46], 5);

    // Next, we set the bounds of the map.
    const southWest = L.latLng(-150, -250);
    const northEast = L.latLng(110, 250);
    const myBounds = L.latLngBounds(southWest, northEast);

    // add a tile layer to the map, set the bounds, set the maximum and minimum zoom
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 8,
      minZoom: 2,
      bounds: myBounds,
      noWrap: true
    }).addTo(this.myMap);

    this.myMap.setMaxBounds(myBounds); // this function makes the map "bounce back" if the user goes beyond the bounds of the map

    this.http.get(this.dataUrl).toPromise().then((data: any) => {
       let earthquakeDataArray = [];
       earthquakeDataArray = data.quakedata.features;

       // tslint:disable-next-line: prefer-for-of
       for (let i = 0;  i < earthquakeDataArray.length; i++) {

           const mag = earthquakeDataArray[i].properties.mag; // temporary variable to store the magnitude
           const coords = []; // temporary variable to store the earthquake's coordinates
           coords[1] = earthquakeDataArray[i].geometry.coordinates[0]; // stores the longitude of the quake
           coords[0] = earthquakeDataArray[i].geometry.coordinates[1]; // stores the latitude of the quake


           //  The line below creates a new circle marker. It gives it a color, radius, ..etc.
           const newCircle = L.circle(coords, {
              color: '#545453',
              fillColor: this.setColor(mag),
              fillOpacity: 0.5,
              radius: this.scaleCircles(mag)
           });

           // we push every single circle marker (regardless of magnitude) to allMagnitudes[]
           this.allMagnitudes.push(newCircle);

           if (mag >= 1) { // if the magnitude is greater than or equal to 1, it gets pushed to magnitudesOver1[]
             this.magnitudesOver1.push(newCircle);
           }
           if (mag >= 2.5) { // if the magnitude is greater than or equal to 2.5, it gets pushed to magnitudesOver2_5[]
              this.magnitudesOver2_5.push(newCircle);
           }
           if (mag >= 4.5) {
             this.magnitudesOver4_5.push(newCircle);
           }

           // during each iteration of the initialization process, we add each newly created circle to the map one by one.
           this.allMagnitudes[i].addTo(this.myMap);
       }
    });

    // the following subscription is used to receive messages passed from main-table.component.ts
    // This is accomplished via a shared service (message.service.ts). We update which group of markers
    // are to be displayed. We simply update the whatToDisplay array to whichever group of circles correspond
    // to the magnitude value passed, then we call updateMap() to make the changes take effect
    this.subscription = this.messageService.notifyObservable$.subscribe((receivedMessage) => {
        if (receivedMessage.magValue === 4.5) {
          this.whatToDisplay = this.magnitudesOver4_5;

        } else if (receivedMessage.magValue === 2.5) {
          this.whatToDisplay = this.magnitudesOver2_5;

        } else if (receivedMessage.magValue === 1) {
          this.whatToDisplay = this.magnitudesOver1;

        } else if (receivedMessage.magValue === 'all') {
          this.whatToDisplay = this.allMagnitudes;
        }

        this.updateMap(); // call updateMap() to change the display based on the changes we just made to whatToDisplay[]
    });

  }

  // the following funcion loops through the array holding all possible markers and removes them from the map
  clearMap() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.allMagnitudes.length; i++ ) {
      this.myMap.removeLayer(this.allMagnitudes[i]);
    }
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
      if (magnitude <= 1.5) {
        return 90000;
      } else if (magnitude <= 4) {
        return 160000;
      } else {
        return 250000;
      }
  }

  // we choose the color for the earthquake marker based on the magnitude value
  // this function simply returns a Hexadecimal RGB value
  setColor(magnitude) {
    if (magnitude <= 1.5) {
      return '#6B05F3';
    } else if (magnitude <= 4) {
      return '#E0FB19';
    } else {
      return '#f03';
    }
  }

  // It is a good idea to unsubscribe to prevent any memory leaks
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
