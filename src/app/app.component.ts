import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";

import { MouseEvent, MapsAPILoader,GoogleMapsAPIWrapper , GoogleMapsScriptProtocol } from '@agm/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapComponentComponent } from './map-component/map-component.component';
import { importType } from '@angular/compiler/src/output/output_ast';

import { } from '@angular/localize'

declare var google: any;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // google maps zoom level
  // initial center position for the map
  
  public zoom: number = 1;
  public dorigin: any
  public ddestination: any
  public geoCoder;
  public isSourcePresent: boolean = false;
  public isDestinationPresent: boolean = true;
  public isGetDirection: boolean = false;
  public coordinates: Coordinates;
  public dir = undefined;

  public sourceMarker: Marker = {
    lat: 19.185405799999998,
    lng: 72.8530944,
    label: 'Source',
    draggable: true
  }

  public destinationMarker: Marker = {
    lat: 19.185405799999998,
    lng: 73.8530944,
    label: 'Destination',
    draggable: true
  }

  public sourceAddress: string;
  public destinationAddress: string;

  @ViewChild("sourceSearch")
  public sourceSearchElementRef: ElementRef;

  @ViewChild("destinationSearch")
  public destinationSearchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private modalService: NgbModal, private wrapper: GoogleMapsAPIWrapper) {
    this.coordinates = {} as Coordinates;
    this.mapsAPILoader = mapsAPILoader;
    this.ngZone = ngZone;
    this.wrapper = wrapper;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      console.log("In Constructor",this.geoCoder);
    });
  }


  ngOnInit() {

    //load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    //   this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder;
    // });

     //set current position
     


     //load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      //this.geoCoder = new google.maps.Geocoder;
      //this.geoCoder = new google.maps.Geocoder();

       let sourceAutocomplete = new google.maps.places.Autocomplete(this.sourceSearchElementRef.nativeElement, { types: ["address"] });
       console.log("Step 1 :",sourceAutocomplete);
       sourceAutocomplete.addListener("place_changed", () => {
         console.log("Step 2 :",sourceAutocomplete);
         this.ngZone.run(() => {
           //get the place result
           let place: google.maps.places.PlaceResult = sourceAutocomplete.getPlace();
           //verify result
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }
           this.zoom = 12;
          this.sourceMarker = { lat: 0, lng: 0, label: 'Source', draggable: true };
          this.sourceMarker['lat'] = place.geometry.location.lat();
          this.sourceMarker['lng'] = place.geometry.location.lng();
         });
       });

       let destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationSearchElementRef.nativeElement, { types: ["address"] });
       destinationAutocomplete.addListener("place_changed", () => {
         this.ngZone.run(() => {
           //get the place result
           let place: google.maps.places.PlaceResult = destinationAutocomplete.getPlace();
           //verify result
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }
           this.zoom = 12;
          this.destinationMarker = { lat: 0, lng: 0, label: 'Destination', draggable: true };
          this.destinationMarker['lat'] = place.geometry.location.lat();
          this.destinationMarker['lng'] = place.geometry.location.lng();
           //calling direction after destination selected
          this.getDirection();

         });
       });

     });

    
  }

  getDirection() {
    console.log("Source :", this.sourceMarker);
    console.log("Destination :", this.destinationMarker);
   
    this.dir = {
      origin: { lat: this.sourceMarker.lat, lng: this.sourceMarker.lng },
      destination: { lat: this.destinationMarker.lat, lng: this.destinationMarker.lng },
    }
    this.isGetDirection = true;
    console.log("getDirectioned");

  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("set current location :", position);
        this.sourceMarker = { lat: 0, lng: 0, label: 'Source', draggable: true };
        this.sourceMarker['lat'] = position.coords.latitude;
        this.sourceMarker['lng'] = position.coords.longitude;
        this.zoom = 8;
        this.isSourcePresent = true;
        this.getAddress(this.sourceMarker.lat, this.sourceMarker.lng);
      });
    }
  }

  getAddress(latitude, longitude) {
    console.log("Get Address :", latitude, longitude);
    console.log("Geo Coder", this.geoCoder );

    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.sourceAddress = results[0].formatted_address;
          this.isSourcePresent = true;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  clickedMarker(label: string) {
    console.log(`clicked the marker: ${label}`)
  }

  markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
    this.getDirection();
  }

}

// just an interface for type safety.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Coordinates {
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressText {
  address: string;
  latitude: number;
  longitude: number;
}