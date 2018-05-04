import { Component } from '@angular/core';
import { BrowsePage } from '../browse/browse';
import { WatchingPage } from '../watching/watching';
import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = WatchingPage;
  tab2Root = BrowsePage;

  constructor(public events: Events) {

  }

  refreshProjects(){
    this.events.publish("refreshProjects");
  }
}
