import { Component,NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CallNumber, SocialSharing, InAppBrowser } from 'ionic-native';
import { MapsPageSignUp } from '../map-SignUp/maps';
import { ContactModel } from './contact.model';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import * as io from 'socket.io-client';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
@Component({
  selector: 'contact-card-page',
  templateUrl: 'contact-card.html'
})
export class DistributorInformation {
  socketHost: string = 'http://192.168.1.111:8080/';
  socket:any;
  zone:any;
  Form: FormGroup;
  contact: ContactModel = new ContactModel();
  maps_page: { component: any };
  lstDistributors: any=[];
  DistributorSelected: any;
  Init: any;
  MapImage: any;
  constructor(
    public nav: NavController,
    public storage: Storage
  ) {

     this.Form = new FormGroup({
        name: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        licence: new FormControl('',Validators.required)
    });
    this.maps_page = { component: MapsPageSignUp };

    this.socket=io.connect(this.socketHost);
    this.zone= new NgZone({enableLongStackTrace: false});
    this.storage.get('person').then((val)=>{
      this.socket.emit('RequestDistributorData',val.PersonCi);
    });
    this.socket.on('DistributorData',(data)=>{
      this.DistributorSelected = data[0];
      $('#MapImage').attr('src',"https://maps.googleapis.com/maps/api/staticmap?center="+data.CoordX+","+data.CoordY+"&zoom=15&size=400x300&scale=2&markers=icon:https://s3-us-west-2.amazonaws.com/ionicthemes-apps-assets/ion2FullApp/pin.min.png|"+data.CoordX+","+data.CoordY+"");     
      this.storage.set('Distributor',this.DistributorSelected);
      this.Form.setValue({name: this.DistributorSelected.DistributorName,
                          address: this.DistributorSelected.DistributorAddress,
                          phone: this.DistributorSelected.DistributorPhone,
                          licence: this.DistributorSelected.DistributorEnvironmentalLicense
                        });
    });
    // Fin Manejo socket   
  }
  // SetInfo(){
  //   console.log(this.lstDistributors.length);
  //     for(var i=0;i<this.lstDistributors.length;i++){
  //       console.log(this.lstDistributors[i].PersonContact+' '+this.user.PersonCi);
  //       if(this.lstDistributors[i].PersonContact==this.user.PersonCi){
  //           this.DistributorSelected=this.lstDistributors[i];
  //           break;
  //       }
  //     }
  // }
  call(number: string){
    CallNumber.callNumber(number, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }

  SetPosition(){
    // this.storage.set('MapImage',$('#MapImage'));
    this.nav.push(MapsPageSignUp);
    // env.nav.setRoot(env.maps_page.component);
  }
  p(){
    alert();
    this.storage.get('DistPosX').then((x)=>{
      this.storage.get('DistPosY').then((y)=>{
          $('#MapImage').attr('src',"https://maps.googleapis.com/maps/api/staticmap?center="+x+","+y+"&zoom=15&size=400x300&scale=2&markers=icon:https://s3-us-west-2.amazonaws.com/ionicthemes-apps-assets/ion2FullApp/pin.min.png|"+x+","+y+"");
      });
    });
  }
  sendMail(email: string){
    SocialSharing.canShareViaEmail().then(() => {
      SocialSharing.shareViaEmail("Hello, I'm trying this fantastic app that will save me hours of development.", "This app is the best!", [email]).then(() => {
        console.log('Success!');
      }).catch(() => {
        console.log('Error');
      });
    }).catch(() => {
       console.log('Sharing via email is not possible');
    });
  }

  openInAppBrowser(website: string){
    new InAppBrowser(website, '_blank', "location=yes");
  }

}