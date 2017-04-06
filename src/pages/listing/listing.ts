import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, LoadingController, Content } from 'ionic-angular';


// import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';

// import { ListingModel } from './listing.model';
// import { ListingService } from './listing.service';


import * as io from 'socket.io-client';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})

// @Component({
//     selector:'my-app',
//     template: `
//     <ul>
//       <li *ngFor="let journey of journeys">
//         {{lst.title}}
//       </li>
//     </ul>
//     `
//     // template: `
//     //   <ion-card *ngFor="let journey of journeys">
//     //     <div class="card-title">{{lst.title}}</div>
//     //   </ion-card>
//     // `
// })



export class ListingPage {

  // Manejo socket
  @ViewChild(Content) content: Content;
  messages: any = [];
  socketHost: string = 'http://34.195.35.232:8080/';
  socket:any;
  chat:any;
  username: string;
  zone:any;
  lstOrders: any = [];
  // Fin manejo socket
  
  
  // lst=[{id:1, title:'Ruta 1'},{id:2, title:'Ruta 2'},{id:3, title:'Ruta 3'}];

  // listing: ListingModel = new ListingModel();
  // loading: any;



  

  constructor(public NavCtrl:NavController, public storage: Storage) {
    // Manejo socket
    this.socket=io.connect(this.socketHost);
    this.zone= new NgZone({enableLongStackTrace: false});
    // this.socket.emit('SelectJourneys','ex app');
    // this.socket.on('SelectJourneys',(data)=>{
    //   this.lstJourneys = data;
    // });  
    this.storage.get('Distributor').then((val)=>{
        this.socket.emit('RequestDistOrders',val.DistributorId);
        this.socket.on('DistOrders',(data)=>{
          this.lstOrders = data;
          for(var i = 0 ; i < this.lstOrders.length ; i++ ){
            console.log(this.lstOrders[i]);
          }
        });  
    });
    // Fin Manejo socket
  }
  
  
  // ionViewDidLoad() {
  //   this.loading.present();
  //   this.listingService
  //     .getData()
  //     .then(data => {
  //       this.listing.banner_image = data.banner_image;
  //       this.listing.banner_title = data.banner_title;
  //       this.listing.populars = data.populars;
  //       this.listing.categories = data.categories;
  //       this.loading.dismiss();
  //     });
  // }


  // goToFeed(category: any) {
  //   console.log("Clicked goToFeed", category);
  //   this.nav.push(FeedPage, { category: category });
  // }

}