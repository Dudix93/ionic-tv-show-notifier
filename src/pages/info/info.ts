import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
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
    "total_episodes":0,
    "next_episode":'',
    "image":{"url":'',"width":0,"height":0}
  }

  list:Array<any> = []
  watching:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage) {
    //console.log(navParams.get('anime'));
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
      }
    })
    let date:Date;
    this.anime.id = navParams.get('anime').id;
    this.anime.title_english = navParams.get('anime').title_english;
    this.anime.title_romaji = navParams.get('anime').title_romaji;
    this.anime.description = navParams.get('anime').description;
    this.anime.total_episodes = navParams.get('anime').total_episodes;
    this.anime.image.url = navParams.get('anime').image_url_lge;
    date = new Date(navParams.get('anime').airing.time);
    this.anime.next_episode = date.getUTCDate().toString()+" - "+(date.getMonth()+1).toString()+" - "+date.getUTCFullYear().toString();

    let img = new Image();
    img.src = this.anime.image.url;
    img.onload = () =>{
      this.anime.image.width = img.width;
      this.anime.image.height = img.height;
    }
  }

  add(){
    this.list.push(this.anime);
    this.storage.set('watching',this.list);
    this.watching = true;
  }

  remove(){
    this.list.splice(this.list.indexOf(this.anime),1);
    this.storage.set('watching',this.list);
    this.watching = false;
  }
}
