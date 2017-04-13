import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, LoadingController, Content } from 'ionic-angular';
import { OrdersPage } from '../Orders/Orders';

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
  lstOrdersP: any = [];
  AuxOrders:any = [];
  constructor(
    public nav: NavController, 
    public storage: Storage
  ) {
    this.socket=io.connect(this.socketHost);
    this.zone= new NgZone({enableLongStackTrace: false});
    this.storage.get('Distributor').then((val)=>{
        var ObjOrder;
        this.socket.emit('RequestDistOrders',val.DistributorId);
        this.socket.on('DistOrders',(data)=>{
          this.lstOrders = data;
          // for(var i=0;i<this.lstOrders.length;i++){
          //   console.log('Id pedido '+this.lstOrders[i].OrderId+' Id viaje'+this.lstOrders[i].JourneyId)
          // }
        });
        this.socket.emit('RequestDistOrdersP',val.DistributorId);
        this.socket.on('DistOrdersP',(data)=>{
          this.lstOrdersP = data;
          // for(var i=0;i<this.lstOrders.length;i++){
          //   console.log('Id pedido '+this.lstOrders[i].OrderId+' Id viaje'+this.lstOrders[i].JourneyId)
          // }
        });
    });
  }

  GoToNewOrders(){
     this.nav.push(OrdersPage)
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
