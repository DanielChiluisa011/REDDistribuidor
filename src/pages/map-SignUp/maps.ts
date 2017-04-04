import { Component, NgZone,ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Keyboard, Geolocation,Geoposition} from 'ionic-native';

import { Observable } from 'rxjs/Observable';
import { DistributorInformation } from '../Distributor-Information/contact-card';
import { GoogleMap } from "../../components/google-map/google-map";
import { GoogleMapsServiceSignUp } from "./maps.service";
import { MapsModel, MapPlace } from './maps.model';
import * as io from 'socket.io-client';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
@Component({
  selector: 'maps-page',
  templateUrl: 'maps.html'
})

export class MapsPageSignUp implements OnInit {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  // Manejo socket
  // messages: any = [];
  socketHost: string = 'http://192.168.1.115:8080/';
  socket:any;
  //username: string;
  zone:any;
  lstUsers: any = [];
  userMarker: any;
  watch: any;
  current_user: any;
  // Fin manejo socket
  signup_page: { component: any };
  map_model: MapsModel = new MapsModel();
  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public GoogleMapsService: GoogleMapsServiceSignUp,
    // public DistInformation: DistributorInformation,
    public storage: Storage
  ) {
    this.signup_page = { component: DistributorInformation };
    this.geolocateMe();
    let env = this;
    let toast = env.toastCtrl.create({
          message: 'Por favor, Mueva el marcador hacia la ubicación exacta de su local de distribución',
          position: 'middle',
          showCloseButton: true
        });
    toast.present();
  }

  ngOnInit() {
    let _loading = this.loadingCtrl.create();
    _loading.present();

    this._GoogleMap.$mapReady.subscribe(map => {
      this.map_model.init(map);
      _loading.dismiss();
    });
    
  }
  
  ionViewDidEnter() {
    // Use ngOnInit instead
  }

  searchPlacesPredictions(query: string){
    let env = this;

    if(query !== "")
    {
      env.GoogleMapsService.getPlacePredictions(query).subscribe(
        places_predictions => {
          env.map_model.search_places_predictions = places_predictions;
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    }else{
      env.map_model.search_places_predictions = [];
    }
  }
  
  SaveCoords(){
    var coord=this.userMarker.marker.getPosition();
    // alert(this.DistInformation.lstDistributors.length);
    // this.DistInformation.MapImage.attr('src',"https://maps.googleapis.com/maps/api/staticmap?center="+coord.lat()+","+coord.lng()+"&zoom=15&size=400x300&scale=2&markers=icon:https://s3-us-west-2.amazonaws.com/ionicthemes-apps-assets/ion2FullApp/pin.min.png|"+coord.lat()+","+coord.lng()+"")
    // this.storage.get('MapImage').then((img)=>{
    //   img.attr('src',"https://maps.googleapis.com/maps/api/staticmap?center="+coord.lat()+","+coord.lng()+"&zoom=15&size=400x300&scale=2&markers=icon:https://s3-us-west-2.amazonaws.com/ionicthemes-apps-assets/ion2FullApp/pin.min.png|"+coord.lat()+","+coord.lng()+"")
    // });
    this.storage.set('DistPosX',coord.lat());
    this.storage.set('DistPosY',coord.lng());
    // alert(this.userMarker.marker.getPosition());
    // this.storage.get('Position').then((val)=>{
    //   alert('position: '+val);
    // }); 
    let env = this;
    this.nav.pop();
    // env.nav.setRoot(env.signup_page.component);
  }

  setOrigin(location: google.maps.LatLng){
    let env = this;
    // Clean map
    env.map_model.cleanMap();

    // Set the origin for later directions
    env.map_model.directions_origin.location = location;

    this.userMarker = env.map_model.myPosition(location, '#00e9d5');
    this.storage.get('user').then((User)=>{
      this.storage.get('person').then((Person)=>{
        this.current_user = {
            user: User,
            person: Person   
        }
      });
    });
    this.current_user = {
        user: this.storage.get('user'),
        person: this.storage.get('person')   
    }
    this.storage.get('user').then((user)=>{
      console.log('Bienvenido: '+ user.UserEmail);
    });
    // With this result we should find restaurants (*places) arround this location and then show them in the map

    // Now we are able to search *restaurants near this location
    // env.GoogleMapsService.getPlacesNearby(location).subscribe(
    //   nearby_places => {
    //     // Create a location bound to center the map based on the results
    //     let bound = new google.maps.LatLngBounds();

    //     for (var i = 0; i < nearby_places.length; i++) {
    //       bound.extend(nearby_places[i].geometry.location);
    //       env.map_model.addNearbyPlace(nearby_places[i]);
    //     }

    //     // Select first place to give a hint to the user about how this works
    //     env.choosePlace(env.map_model.nearby_places[3]);

    //     // To fit map with places
    //     env.map_model.map.fitBounds(bound);
    //   },
    //   e => {
    //     console.log('onError: %s', e);
    //   },
    //   () => {
    //     console.log('onCompleted');
    //   }
    // );
  }

  selectSearchResult(place: google.maps.places.AutocompletePrediction){
    let env = this;

    env.map_model.search_query = place.description;
    env.map_model.search_places_predictions = [];

    // We need to get the location from this place. Let's geocode this place!
    env.GoogleMapsService.geocodePlace(place.place_id).subscribe(
      place_location => {
        env.setOrigin(place_location);
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
  }

  clearSearch(){
    let env = this;
    Keyboard.close();
    // Clean map
    env.map_model.cleanMap();
  }

  geolocateMe(){
    let env = this,
        _loading = env.loadingCtrl.create();

    _loading.present();

    Geolocation.getCurrentPosition().then((position) => {
      let current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      env.map_model.search_query = position.coords.latitude.toFixed(2) + ", " + position.coords.longitude.toFixed(2);
      env.setOrigin(current_location);
      env.map_model.using_geolocation = true;

      _loading.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
      _loading.dismiss();
    });
  }

  choosePlace(place: MapPlace){
    let env = this;

    // Check if the place is not already selected
    if(!place.selected)
    {
      // De-select previous places
      env.map_model.deselectPlaces();
      // Select current place
      place.select();

      // Get both route directions and distance between the two locations
      let directions_observable = env.GoogleMapsService
            .getDirections(env.map_model.directions_origin.location, place.location),
          distance_observable = env.GoogleMapsService
            .getDistanceMatrix(env.map_model.directions_origin.location, place.location);

      Observable.forkJoin(directions_observable, distance_observable).subscribe(
        data => {
          let directions = data[0],
              distance = data[1].rows[0].elements[0].distance.text,
              duration = data[1].rows[0].elements[0].duration.text;

          env.map_model.directions_display.setDirections(directions);

          let toast = env.toastCtrl.create({
                message: 'That\'s '+distance+' away and will take '+duration,
                duration: 3000
              });
          toast.present();
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    }
  }


}
