import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../../app/globalVars';
import { InfoPage } from '../info/info';
import { Genre } from '../../models/genre';

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
  showGenres:boolean = false;

  // client_credentials:number = 403;
  // client_secret:string = 'gf66CF5kVIEhbyr5yKnweAVDxKxIZUmhuDQg8tTO';

  client_credentials:string = 'animunotifier-j0ybs';
  client_secret:string = 'UqdeljBAhwnTPoT5TPV';

  constructor(
    public navCtrl: NavController,
    public restApi: RestapiServiceProvider,
    public storage: Storage,
    public globalVars: GlobalVars) {

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
      console.log(data);
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
        console.log(g);
      }
    });
    this.selectedGenres.push(genre_name);
  }

  unselectGenre(genre_name:string){
    this.genres.forEach(g=>{
      if(g.name == genre_name){
        g.selected = false;
        console.log(g);
      }
    });
    this.selectedGenres.splice(this.selectedGenres.indexOf(genre_name),1);
  }

  showCategories(){
    this.getAnimes();
    this.showGenres = true;
  }

  hideCategories(){
    let selectedAnimes:Array<any> = [];
    this.showGenres = false;
    this.animes.forEach(a=>{
      let found = 0;
      this.selectedGenres.forEach(g=>{
        if(a.genres.includes(g)){
          found++;
          //console.log(a.genres);
        }
      });
      if(found == this.selectedGenres.length){
        //console.log('found cat: '+a.genres);
        selectedAnimes.push(a);
      }
    });
    this.animes = selectedAnimes;
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
    this.searchString = null;
  }

  clearCelectedGenres(){
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

}
