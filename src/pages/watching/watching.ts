import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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
    public storage: Storage,
    public event: Events) {
      this.refreshList();
      this.event.subscribe('refreshList',()=>{
        this.refreshList();
      });
  }

  refreshList(){
    this.storage.get('watching').then(data=>{
      if(data != null)this.watching = data;
      this.watching.sort(this.compareValues("next_episode",'asc'));
    });
  }
  
  counter(t){
    let cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  if(d != 0) return d+" d "+h+" h "+m+" m";
  else if(d == 0) return h+" h "+m+" min";
  else return m+" minutes";
}

compareValues(key, order='asc') {
  return function(a, b) {
  
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0; 
    }

    const valueA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const valueB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (valueA > valueB) {
      comparison = 1;
    } else if (valueA < valueB) {
      comparison = -1;
    }
    return (order == 'desc') ? (comparison * -1) : comparison
  };
}
  
  remove(anime){
    this.watching.splice(this.watching.indexOf(anime),1);
    this.storage.set('watching',this.watching);
  }

}
