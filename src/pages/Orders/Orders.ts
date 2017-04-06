import { Component,NgZone } from '@angular/core';
import { NavController, SegmentButton, AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import * as io from 'socket.io-client';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';

@Component({
  selector: 'form-layout-page',
  templateUrl: 'Orders.html'
})
export class OrdersPage {
  section: string;
  order_form: FormGroup;
  socketHost: string = 'http://34.195.35.232:8080/';
  socket:any;
  zone:any;
  lstWaste:any=[];
  categories_checkbox_open: boolean;
  categories_checkbox_result;
  modeKeys: any;
  items:any;
  constructor(
    public nav: NavController, 
    public storage: Storage,
    public alertCtrl: AlertController
  ) {
    // this.items.push({ value: 1, text: 'Super Distributor', checked: false });
    // this.items.push({ value: 2, text: 'Distributor', checked: false });
    // this.items.push({ value: 3, text: 'Retailer', checked: false });
    // this.items.push({ value: 4, text: 'End User', checked: false });
    this.section = "event";
    this.socket=io.connect(this.socketHost);
    this.zone= new NgZone({enableLongStackTrace: false});
    this.socket.on('selectWaste',(data)=>{
    this.lstWaste = data;
      $('#cmbNewOrderWaste').empty();
       	$('#cmbNewOrderWaste').append('<option> Seleccione un tipo de desecho</option>');
       	for (var i = 0; i < this.lstWaste.length; i++) {
	   		$('#cmbNewOrderWaste').append(new Option(this.lstWaste[i].WasteName, 'name',true,true));
	   	}
    });  
    this.order_form = new FormGroup({
      num: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      waste: new FormControl('', Validators.required),
    });
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }



  createOrder(){
    //alert(this.order_form.get('num').value+' '+this.order_form.get('date').value+' '+this.order_form.get('quantity').value+' '+$('#cmbNewOrderWaste').index());
    // this.storage.get('Distributor').then((val)=>{
    //     var ObjOrder = {
    //       id: this.order_form.get('num'),
    //       date: this.order_form.get('date'),
    //       quantity: this.order_form.get('quantity'),
    //       distributor: val.DistributorId,
    //     }
    // });
  }


  chooseCategory(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Category');

    alert.addInput({
      type: 'checkbox',
      label: 'Alderaan',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Bespin',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.categories_checkbox_open = false;
        this.categories_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.categories_checkbox_open = true;
    });
  }

}
