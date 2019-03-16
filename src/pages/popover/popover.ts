import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare let cordova:any

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

    sound:boolean = true
    vibrate:boolean = true


  constructor(public storage: Storage, public viewCtr:ViewController) {
    this.getData();
  }


  changeNotificationSettings(){
    this.getData();
    cordova.plugins.notification.local.setDefaults({
      sound: this.sound,
      vibrate: this.vibrate
    });
    this.storage.set('notifications',{sound:this.sound,vibrate:this.vibrate});
    this.viewCtr.dismiss();
  }

  getData(){
    //this.storage.clear();
    this.storage.get('notifications').then(data=>{
      let n = data;
      console.log("Reading: "+JSON.stringify(n));
      if(n == null)this.storage.set('notifications',{sound:this.sound,vibrate:this.vibrate});
      else{
        this.sound = n.sound;
        this.vibrate = n.vibrate;
      }
    });
  }
}
