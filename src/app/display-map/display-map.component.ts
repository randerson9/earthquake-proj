import { Component, OnInit, OnDestroy } from '@angular/core';
import '../../../node_modules/loader-runner/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {MessageService} from '../_services';

declare let L;

@Component({
  selector: 'app-display-map',
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.css']
})

export class DisplayMapComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  myMap: any;
  dataUrl = 'http://localhost:3000/api/quakedata';
  // dataUrl = '../assets/data/testquake.json';

  // define feature groups for earthquakes with different magnitudes.
  allMagnitudes = new Array();   // holds markers for all earthquake data
  // tslint:disable-next-line: variable-name
  magnitudesOver4_5 = new Array();   // holds markers for over 4.5 magnitude
  // tslint:disable-next-line: variable-name
  magnitudesOver2_5 = new Array();
  magnitudesOver1 = new Array();
  // whatToDisplay = new Array();
  whatToDisplay = this.allMagnitudes;

  constructor(private http: HttpClient, private messageService: MessageService) {
    this.http.get(this.dataUrl).toPromise().then(data => {
      console.log(data);
    });
  }

  ngOnInit() {

    this.myMap = L.map('map').setView([39.585, -103.46], 5);
    const southWest = L.latLng(-150, -250);
    const northEast = L.latLng(110, 250);
    const myBounds = L.latLngBounds(southWest, northEast);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 8,
      minZoom: 2,
      bounds: myBounds,
      noWrap: true
    }).addTo(this.myMap);

    this.myMap.setMaxBounds(myBounds); // remove later to avoid map "bouncing back"

    this.http.get(this.dataUrl).toPromise().then((data: any) => {
       let earthquakeDataArray = [];
       earthquakeDataArray = data.quakedata.features;

       // tslint:disable-next-line: prefer-for-of
       for (let i = 0;  i < earthquakeDataArray.length; i++) {

           const mag = earthquakeDataArray[i].properties.mag;
           const coords = [];
           coords[1] = earthquakeDataArray[i].geometry.coordinates[0];
           coords[0] = earthquakeDataArray[i].geometry.coordinates[1];


           //  EVERYHING BELOW THIS LINE IS PART OF THE EXPERIMENT
           const newCircle2 = L.circle(coords, {
              color: '#545453',
              fillColor: this.setColor(mag),
              fillOpacity: 0.5,
              radius: this.scaleCircles(mag)
            // radius: 75000
           });
           this.allMagnitudes.push(newCircle2);

           if (mag >= 1) {
             this.magnitudesOver1.push(newCircle2);
           }
           if (mag >= 2.5) {
              this.magnitudesOver2_5.push(newCircle2);
           }
           if (mag >= 4.5) {
             this.magnitudesOver4_5.push(newCircle2);
           }

           this.allMagnitudes[i].addTo(this.myMap);

           // myMap.removeLayer(this.allMagnitiudes[i]);
           // remove all quakes under 4.5 mag from map
           // this.removeAllUnder4_5();
    }
    });

    this.subscription = this.messageService.notifyObservable$.subscribe((res) => {
      // if (res.hasOwnProperty('option') && res.option === 'onSubmit') {
        // alert(res.value);
        if (res.value === 4.5) {
          this.whatToDisplay = this.magnitudesOver4_5;
        } else if (res.value === 2.5) {
          this.whatToDisplay = this.magnitudesOver2_5;
        } else if (res.value === 1) {
          this.whatToDisplay = this.magnitudesOver1;
        } else if (res.value === 'all') {
          this.whatToDisplay = this.allMagnitudes;
        }
        this.updateMap();
    });

  }

clearMap() {
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.allMagnitudes.length; i++ ) {
    this.myMap.removeLayer(this.allMagnitudes[i]);
  }
}

updateMap() {
  this.clearMap();
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.whatToDisplay.length; i++) {
    this.whatToDisplay[i].addTo(this.myMap);
  }

}

displayAllOver4_5() {
  this.clearMap();
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.magnitudesOver4_5.length; i++) {
    this.magnitudesOver4_5[i].addTo(this.myMap);
  }
}

displayAllOver2_5() {
  this.clearMap();
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.magnitudesOver2_5.length; i++) {
    this.magnitudesOver2_5[i].addTo(this.myMap);
  }
}

displayAllOver1() {
  this.clearMap();
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.magnitudesOver1.length; i++) {
    this.magnitudesOver1[i].addTo(this.myMap);
  }
}

scaleCircles(magnitude) {
    if (magnitude <= 1.5) {
      return 90000;
    } else if (magnitude <= 4) {
      return 160000;
    } else {
      return 250000;
    }
}

setColor(magnitude) {
  if (magnitude <= 1.5) {
    return '#6B05F3';
  } else if (magnitude <= 4) {
    return '#E0FB19';
  } else {
    return '#f03';
  }
}


someMethod() {
  alert('ITS WORKING!!!');
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}

}
