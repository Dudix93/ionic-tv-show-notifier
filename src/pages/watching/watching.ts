import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-watching',
  templateUrl: 'watching.html',
})
export class WatchingPage {

  watching:Array<any> = []
  now:Date = new Date();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage) {
      this.storage.get('watching').then(data=>{
        this.watching = data;
      });
  }

  remove(anime){
    this.watching.splice(this.watching.indexOf(anime),1);
    this.storage.set('watching',this.watching);
  }

}
