import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RestapiServiceProvider {
  err:any;
  data:any;
  apiUrl:string;
  //apiUrl = 'http://192.168.137.1:9090';
  //apiUrl = 'http://localhost:3000';
  constructor(public http: Http, 
              public storage:Storage){
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

  headers():RequestOptions{
    let headers = new Headers();
    //headers.append('Accept', 'application/vnd.api+json');
    headers.append('Accept', 'text/xml, text/*');
    //headers.append('Content-Type', 'application/vnd.api+json');
    headers.append('Content-Type', 'text/xml, text/*');
    headers.append('Access-Control-Allow-Origin', '*');
    // let encoded_value = btoa('animunotifier' + ":" + 'Elpsycongoro');
    // headers.append("Authorization", "Basic " + encoded_value);
    headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return new RequestOptions({headers:headers});
  }


  getUsers() {
    //this.get(this.getApiUrl,"users",null,this.headers);
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        //console.log(value);
        this.http.get('https://animunotifier:Elpsycongoro@myanimelist.net/api/anime/search.xml?q=full+metal',this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, (err) => {
          this.err = err;
          resolve(this.err);
        });
      });
    });
  }
}

  