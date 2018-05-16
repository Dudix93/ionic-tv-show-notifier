import { Component } from '@angular/core';
import { NavController, NavParams, Events, Platform, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { UserService } from '../../providers/user-service/user-service';
import { GlobalVars } from '../../app/globalVars';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user';

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
  client_credentials:string = 'animunotifier-j0ybs';
  client_secret:string = 'UqdeljBAhwnTPoT5TPV';
  toast = this.toastCtrl.create();
  response:any

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public event: Events,
    public platform: Platform,
    public toastCtrl:ToastController,
    public alertCtrl:AlertController,
    public localNotification: PhonegapLocalNotification,
    public api: RestapiServiceProvider,
    public globalVars: GlobalVars,
    public db: AngularFireDatabase,
    public userService: UserService) {
      //this.userService.addUser(new User(db.createPushId(),"dodo","dodo123"));
      this.api.authorize({grant_type:"client_credentials",client_id:this.client_credentials,client_secret:this.client_secret}).then(data=>{
        this.response = data;
        this.globalVars.setToken(this.response.json().access_token);
        this.refreshList();
      });

      this.event.subscribe('refreshList',()=>{
        this.refreshList();
      });

      setInterval(()=>{
        this.refreshList();
      },60000);

  }

  refreshList(){
    this.toast.dismiss();
    this.storage.get('watching').then(data=>{
      if(data != null && data != ''){
        this.watching = data;
        if(this.watching.length == 0)this.showToast("Watching list is empty");
        this.watching.sort(this.compareValues("next_episode",'asc'));
        this.newest.title = this.watching[0].title;
        this.newest.time_left = this.counter(this.watching[0].next_episode);
        this.newest.image.url = this.watching[0].image.url;
        this.platform.ready().then((readySource) => {
          this.newest.image.width = this.platform.width()/3;
          this.newest.image.height = this.watching[0].image.height - (this.watching[0].image.width - this.newest.image.width) - ((this.watching[0].image.width - this.newest.image.width)/3);
        });

        this.watching.forEach(element=>{
          if(element.next_episode.valueOf() < new Date().valueOf()){
            this.api.getData(element.id).then(data=>{
              let anime:any = data;
              this.watching[this.watching.indexOf(element)].time_left = this.newest.time_left = this.counter(new Date(anime.airing.time));
              this.watching[this.watching.indexOf(element)].next_episode = new Date(anime.airing.time);
              this.storage.set('watching',this.watching);
            });
          }
          element.time_left = this.counter(element.next_episode);
        })
      }
      else this.showToast("Watching list is empty");
    });
  }
  
  counter(ne){
    let t = ne.valueOf() - new Date().valueOf();
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
    let alert = this.alertCtrl.create({
      title: anime.title,
      inputs: [
      ],
      buttons: [
        {
          text: "Back",
          role: "cancel"
        },
        {
          text: "Remove",
          handler: () => {
            this.watching.splice(this.watching.indexOf(anime),1);
            this.removedToast(anime.title+" has been removed from the list");
            this.storage.set('watching',this.watching).then(()=>{
              this.refreshList();
            });
          }
        }
      ]
    });
    alert.present();
  }

  moreInfo(anime){
    let alert = this.alertCtrl.create({
      title: anime.title,
      message: "Next episode: "+anime.next_episode.getUTCDate()+"-"+(anime.next_episode.getUTCMonth()+1)+"-"+anime.next_episode.getFullYear()+"<br>Aired: "+(anime.episodes.next-1)+"/"+anime.episodes.total,
      buttons: [
        {
          text: "Back",
          role: "cancel"
        }
      ]
    });
    alert.present();
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

  removedToast(message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-message",
    });
    toast.present();
  }

  phoneNotification(id:number,title:string,text:string){
    cordova.plugins.notification.local.schedule({
    id: id,
    title: title,
    text: text,
    trigger: {at: new Date().setSeconds(new Date().getSeconds()+15)}
  }); 
}
}
