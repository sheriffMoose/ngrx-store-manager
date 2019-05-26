import { Component } from '@angular/core';
import { StoreFacade } from 'ngrx-store-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  data;
  syncData;

  constructor(public store: StoreFacade) { }

  ngOnInit() {
    // ASYNC
    this.data = this.store.select('test', false);
  }

  getData() {
    this.store.getData('test');
  }

  setData() {
    this.store.setData('test', { name: 'Mostafa' }).subscribe(result => {
      this.syncData = result;
    });
  }

  getOtherData() {
    this.store.getData('test', 'GET_OTHER');
  }

  setOtherData() {
    this.store.setData('test', { name: 'Ruvalter' }, 'SET_OTHER');
  }
}
