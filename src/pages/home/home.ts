import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../../app/globalVars';
import { InfoPage } from '../info/info';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  animu:any;
  response:any;
  animes:Array<any> = []
  searchResults:Array<any> = []
  searchString:string = null

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
        });
      });
    }
  }

  search(){
    this.animes.forEach(a=>{
      if(a.title_english.toLocaleLowerCase().includes(this.searchString)){
        this.searchResults.push(a);
      }
    });
  }

  clearSearch(){
    this.searchResults = [];
    this.searchString = null;
  }

  moreInfo(anime:any){
    this.navCtrl.push(InfoPage,{"anime":anime});
  }

}
