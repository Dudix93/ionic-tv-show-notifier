import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare let cordova:any

@Component({
  selector: 'page-watching',
  templateUrl: 'watching.html',
})
export class WatchingPage {

  watching:Array<any> = []
  now:Date = new Date();
  newest = {
    "title":'',
    "time_left":'',
    "image":{"url":'',"width":0,"height":0}
  }
  toast = this.toastCtrl.create();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public event: Events,
    public platform: Platform,
    public toastCtrl:ToastController) {
      this.event.subscribe('refreshList',()=>{
        this.refreshList();
      });
      setInterval(()=>{
        this.refreshList();
      },60000);

      this.platform.ready().then((readySource) => {
        this.phoneNotification(1,'Twoje powiadomienie:',"wabalaba dub dub");
      });
  }

  refreshList(){
    this.toast.dismiss();
    this.storage.get('watching').then(data=>{
      if(data != null && data != ''){
        this.watching = data;
        if(this.watching.length == 0)this.showToast("Watching list is empty");
        this.watching.sort(this.compareValues("next_episode",'asc'));
        this.newest.title = this.watching[0].title;
        this.newest.time_left = this.counter((this.watching[0].next_episode).valueOf() - new Date().valueOf());
        this.newest.image.url = this.watching[0].image.url;
        this.platform.ready().then((readySource) => {
          this.newest.image.width = this.platform.width()/3;
          this.newest.image.height = this.watching[0].image.height - (this.watching[0].image.width - this.newest.image.width) - ((this.watching[0].image.width - this.newest.image.width)/3);
        });

        this.watching.forEach(element=>{
          element.time_left = this.counter(element.next_episode.valueOf() - new Date().valueOf());
        })
      }
      else this.showToast("Watching list is empty");
    console.log(this.watching);
    });
  }
  
  counter(t){
    let cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000)
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
    this.storage.set('watching',this.watching).then(()=>{
      this.refreshList();
    });
  }

  showToast(message:string) {
    this.toast.dismiss();
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 60000,
      position: 'middle',
      cssClass: "toast-message",
      dismissOnPageChange: true
    });
    this.toast.present();
  }

  phoneNotification(id:number,title:string,text:string){
    cordova.plugins.notification.local.schedule({
    id: id,
    title: title,
    text: text,
  }); 
}
}
