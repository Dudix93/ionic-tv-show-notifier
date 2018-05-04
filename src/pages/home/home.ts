import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { Storage } from '@ionic/storage';
import { GlobalVars } from '../../app/globalVars';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  animu:any;
  response:any;
  animes:Array<string> = []
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
      this.searchString = this.searchString.substr(0, 1).toUpperCase() + this.searchString.substr(1);
    }
    for(let i=0; i<500; i++){
      this.restApi.getAnime(i).then(data=>{
        this.animu = data;
        if(this.animu.status != 404 && this.animu.title_english.startsWith(this.searchString)){
          this.animes.push(this.animu);
        }
      })
    }
  }

}
