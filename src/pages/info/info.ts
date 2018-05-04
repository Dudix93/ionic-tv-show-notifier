import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  anime = {
    "title_english":'',
    "title_romaji":'',
    "description":'',
    "total_episodes":0,
    "image":{"url":'',"width":0,"height":0}
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams.get('anime'));
    this.anime.title_english = navParams.get('anime').title_english;
    this.anime.title_romaji = navParams.get('anime').title_romaji;
    this.anime.description = navParams.get('anime').description;
    this.anime.total_episodes = navParams.get('anime').total_episodes;
    this.anime.image.url = navParams.get('anime').image_url_lge;

    let img = new Image();
    img.src = this.anime.image.url;
    img.onload = () =>{
      this.anime.image.width = img.width;
      this.anime.image.height = img.height;
    }
  }



}
