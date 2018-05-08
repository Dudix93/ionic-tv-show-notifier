import { Component } from '@angular/core';
import { NavController, AlertController, Checkbox } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../../app/globalVars';
import { InfoPage } from '../info/info';
import { Genre } from '../../models/genre';
import { DatePicker } from '@ionic-native/date-picker';

@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html'
})
export class BrowsePage {

  animu:any;
  response:any;
  animes:Array<any> = []
  genres:Array<any> = []
  selectedGenres:Array<string> = [];
  searchResults:Array<any> = []
  searchString:string = ''
  order:string = 'asc'
  title_type:string = 'title_english'
  showGenres:boolean = false;
  notification = {
    same:true,
    hour:new Date()
  }

  // client_credentials:number = 403;
  // client_secret:string = 'gf66CF5kVIEhbyr5yKnweAVDxKxIZUmhuDQg8tTO';

  client_credentials:string = 'animunotifier-j0ybs';
  client_secret:string = 'UqdeljBAhwnTPoT5TPV';

  constructor(
    public navCtrl: NavController,
    public restApi: RestapiServiceProvider,
    public storage: Storage,
    public globalVars: GlobalVars,
    public datePicker: DatePicker,
    public alertCtrl: AlertController,) {

      this.restApi.authorize({grant_type:"client_credentials",client_id:this.client_credentials,client_secret:this.client_secret}).then(data=>{
        this.response = data;
        //console.log("token: "+this.response.json().access_token);
        this.globalVars.setToken(this.response.json().access_token);
        this.getAnimes();
        this.getGenres();
      });
  }

  getAnimes(){
    this.animes = [];
    if(this.searchString != null && this.searchString != ''){
      this.searchString = this.searchString.toLocaleLowerCase();
    }
    for(let i=1; i<20; i++){
      this.restApi.getAnime(i).then(data=>{
        this.animu = data;
        this.animu.forEach(a => {
          this.animes.push(a);
          this.animes.sort(this.compareValues("title_english",'asc'));
        });
      });
    }
  }

  getGenres(){
    this.restApi.getGenres().then(data=>{
      let gen:any = data;
      gen.forEach(g => {
        this.genres.push(new Genre(false,g.genre));
      });
    });
  }

  selectGenre(genre_name:string){
    this.genres.forEach(g=>{
      if(g.name == genre_name){
        g.selected = true;
      }
    });
    this.selectedGenres.push(genre_name);
  }

  unselectGenre(genre_name:string){
    this.genres.forEach(g=>{
      if(g.name == genre_name){
        g.selected = false;
      }
    });
    this.selectedGenres.splice(this.selectedGenres.indexOf(genre_name),1);
    this.searchByGenre();
  }

  showCategories(){
    this.getAnimes();
    this.showGenres = true;
  }

  searchByGenre(){
    console.log('genres: '+this.selectedGenres);
    let selectedAnimes:Array<any> = [];
    this.showGenres = false;
    this.animes.forEach(a=>{
      let found = 0;
      this.selectedGenres.forEach(g=>{
        if(a.genres.includes(g)){
          found++;
          console.log(a.genres);
        }
      });
      if(found == this.selectedGenres.length){
        console.log('found cat: '+a.genres);
        selectedAnimes.push(a);
      }
    });
    this.searchResults = selectedAnimes;
    console.log(this.searchResults);
  }  

  search(){
    this.searchResults = [];
    this.animes.forEach(a=>{
      if(a.title_english.toLocaleLowerCase().includes(this.searchString.toLocaleLowerCase())){
        this.searchResults.push(a);
      }
    });
  }

  clearSearch(){
    this.searchResults = [];
    this.searchString = '';
  }

  clearSelectedGenres(){
    this.getAnimes();
    this.selectedGenres = [];
    this.genres.forEach(g=>{
      g.selected = false;
    });
  }

  moreInfo(anime:any){
    this.restApi.getData(anime.id).then(data=>{
      this.navCtrl.push(InfoPage,{"anime":data});
    });
  }

  changeOrder(){
    if(this.order == 'asc')this.order = 'desc'
    else this.order = 'asc'
    if(this.searchResults.length != 0)this.searchResults.sort(this.compareValues(this.title_type,this.order));
    else this.animes.sort(this.compareValues(this.title_type,this.order));
  }

  changeTitleType(){
    if(this.title_type == 'title_romaji')this.title_type = 'title_japanese'
    else if(this.title_type == 'title_japanese')this.title_type = 'title_english'
    else this.title_type = 'title_romaji'
  }

  changeNotificationHour(){
    this.storage.get('notification_hour').then(data=>{
      if (data == null){
        this.notification.same = true;
        this.notification.hour = new Date();
      }
      else this.notification = data;
      console.log(this.notification);
      let hour = {
        h:this.notification.hour.getHours(),
        m:(this.notification.hour.getMinutes() < 10) ? "0"+this.notification.hour.getMinutes() : +this.notification.hour.getMinutes()
      }
      let alert = this.alertCtrl.create({
        title: 'Notification hour:',
        inputs: [
          {
            name: 'original_hour',
            type: 'checkbox',
            label: 'Same as original airing hour',
            checked: this.notification.same
          }
        ],
        buttons: [
          {
            text: hour.h+":"+hour.m,
            handler: data => {
              this.datePicker.show({
                date: new Date(),
                mode: 'time',
                is24Hour: true,
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
              }).then(
                date => {
                  this.notification.hour = date;
                  this.storage.set('notification_hour',this.notification);
                  console.log("picked date: "+date);
                },
                err => console.log('Error occurred while getting date: ', err)
              );
            }
          },
          {
            text: "OK",
            handler: data => {
              if(data.length == 1)this.notification.same = true;
              else this.notification.same = false;
              console.log(this.notification);
              this.storage.set('notification_hour',this.notification)
            }
          }
        ]
      });
      alert.present();
    });
  }

  compareValues(key, order = 'asc') {
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

}
