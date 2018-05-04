import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GlobalVars } from '../../app/globalVars';

@Injectable()
export class RestapiServiceProvider {
  err:any;
  data:any;
  apiUrl = 'https://anilist.co/api';
  constructor(
    public http: Http, 
    public storage:Storage,
    public globalVars:GlobalVars){
  }

  // get(apiUrl,resource,id,headers):Promise<any>{
  //   console.log(apiUrl);
  //   if(id == null){
  //     console.log("nie ma id");
  //     return new Promise(resolve => {
  //       this.http.get(apiUrl+'/'+resource)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         this.data = data;
  //         resolve(this.data);
  //       });
  //   });
  //   }
  //   else{
  //     console.log("jest id");
  //     return new Promise(resolve => {
  //       this.http.get(apiUrl+'/'+resource+'/'+id)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         this.data = data;
  //         resolve(this.data);
  //       });
  //   });
  //   }
  // }

  // post(apiUrl,resource,data,headers):Promise<any>{
  //   return new Promise((resolve, reject) => {
  //       this.http.post(apiUrl+'/'+resource+'/',data,headers)
  //       .subscribe(res => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  // delete(apiUrl,resource,id):Promise<any>{
  //   return new Promise((resolve, reject) => {
  //       this.http.delete(apiUrl+'/'+resource+'/',id)
  //       .subscribe(res => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  headers(token):RequestOptions{
    let headers = new Headers();
    if(token != null)headers.append("Authorization", "Bearer " + token);
    headers.append('Accept', 'application/vnd.api+json');
    headers.append('Content-Type', 'application/vnd.api+json');
    //headers.append('Accept', 'text/xml, text/*');
    //headers.append('Content-Type', 'text/xml, text/*');
    headers.append('Access-Control-Allow-Origin', '*');
    // let encoded_value = btoa('animunotifier' + ":" + 'Elpsycongoro');
    // headers.append("Authorization", "Basic " + encoded_value);
    headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return new RequestOptions({headers:headers});
  }


  authorize(data){
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/auth/access_token',data,this.headers(null))
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
  }

  getAnime(id) {
    //this.get(this.getApiUrl,"users",null,this.headers);
    return new Promise(resolve => {
        //console.log("token: "+this.globalVars.getToken());
        this.http.get(this.apiUrl+'/anime/'+id,this.headers(this.globalVars.getToken()))
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, (err) => {
          this.err = err;
          resolve(this.err);
        });
    });
  }
}

  