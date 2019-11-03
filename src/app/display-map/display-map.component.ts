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
  allMagnitiudes = new Array();   // holds markers for all earthquake data
  // tslint:disable-next-line: variable-name
  magnitiudesUnder4_5 = new Array();   // holds markers for over 4.5 magnitude
  // tslint:disable-next-line: variable-name
  magnitiudesUnder2_5 = new Array();
  magnitudesUnder1 = new Array();

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
           this.allMagnitiudes.push(newCircle2);

           if (mag < 1) {
             this.magnitudesUnder1.push(newCircle2);
           }
           if (mag < 2.5) {
              this.magnitiudesUnder2_5.push(newCircle2);
           }
           if (mag < 4.5) {
             this.magnitiudesUnder4_5.push(newCircle2);
           }

           this.allMagnitiudes[i].addTo(this.myMap);

           // myMap.removeLayer(this.allMagnitiudes[i]);
           // remove all quakes under 4.5 mag from map
           // this.removeAllUnder4_5();
    }
    });

    this.subscription = this.messageService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'onSubmit') {
        // alert(res.value);
        if (res.value === 'From header') {
          this.removeAllUnder4_5();
        }

      }
    });

  }

removeAllUnder4_5() {
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.magnitiudesUnder4_5.length; i++) {
    this.myMap.removeLayer(this.magnitiudesUnder4_5[i]);
  }
}

removeAllUnder2_5() {
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.magnitiudesUnder2_5.length; i++) {
    this.myMap.removeLayer(this.magnitiudesUnder2_5[i]);
  }
}

removeAllUnder1() {
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < this.magnitudesUnder1.length; i++) {
    this.myMap.removeLayer(this.magnitudesUnder1[i]);
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
