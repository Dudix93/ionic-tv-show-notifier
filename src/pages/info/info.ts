import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AnimeWatching } from '../../models/animeWatching';

declare let cordova:any

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  anime = {
    "id":0,
    "title_english":'',
    "title_romaji":'',
    "description":'',
    "next_episode":new Date(),
    "next_episode_date":'',
    "image":{"url":'',"width":0,"height":0},
    "episodes":{"total":0,"next":0,"unwatched":0}
  }

  list:Array<any> = []
  watching:boolean = false;
  unselectable:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public toastCtrl: ToastController,
    public platform: Platform) {
    this.storage.get('watching').then(data=>{
      this.list = data;
      if(this.list != null){
        this.list.forEach(element => {
          if(element.id == navParams.get('anime').id){
            this.watching = true;
          }
        });
      }
      else{
        this.storage.set('watching',[]);
        this.list = [];
      }
    })
    let date:Date;
    console.log('navParams: '+navParams.get('anime'));
    this.anime.id = navParams.get('anime').id;
    this.anime.title_english = navParams.get('anime').title_english;
    this.anime.title_romaji = navParams.get('anime').title_romaji;
    if(navParams.get('anime').description != null)this.anime.description = navParams.get('anime').description;
    else this.anime.description = "No description provided."
    this.anime.episodes.total = navParams.get('anime').total_episodes;
    this.anime.image.url = navParams.get('anime').image_url_lge;
    if(navParams.get('anime').airing != null){
      date = new Date(navParams.get('anime').airing.time);
      this.anime.next_episode = date;
      this.anime.episodes.next = navParams.get('anime').airing.next_episode;
      this.anime.next_episode_date = date.getUTCDate().toString()+" - "+(date.getMonth()+1).toString()+" - "+date.getUTCFullYear().toString();
    }
    else{
      this.unselectable = true;
    }


    let img = new Image();
    img.src = this.anime.image.url;
    img.onload = () =>{
      this.anime.image.width = img.width;
      this.anime.image.height = img.height;
    }
  }

  add(){
    this.list.push(new AnimeWatching(this.anime.id,this.anime.title_english,this.anime.next_episode,0,this.anime.image,this.anime.episodes));
    this.storage.set('watching',this.list);
    this.watching = true;
    this.phoneNotification(this.anime.id,this.anime.title_english,this.anime.next_episode);
    this.showToast("The anime has been added to the list.");
  }

  remove(){
    cordova.plugins.notification.local.cancel(this.anime.id);
    this.list.splice(this.list.indexOf(this.anime),1);
    this.storage.set('watching',this.list);
    this.watching = false;
    this.showToast("The anime has been removed from the list.");
  }

  showToast(message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-message",
      dismissOnPageChange: true
    });
    toast.present();
  }

  phoneNotification(id:number,title:string,date:Date){
    if(this.platform.is('cordova')){
      this.platform.ready().then((readySource) => {
        cordova.plugins.notification.local.schedule({
          id: id,
          title: "New episode",
          text: "An new episode of "+title+" has arrived",
          at: date,
          every: 'week'
        }); 
        cordova.plugins.notification.local.on('trigger',()=>{
          let watching;
          this.storage.get('watching').then(data=>{
            watching = data;
            watching.forEach(element => {
              if(element.id == id){
                element.episodes.unwatched++;
                this.storage.set('watching',watching);
              }
            });
          })
        })
      });
    }
}
}