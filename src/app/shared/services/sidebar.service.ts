import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  main = new Subject<boolean>();
  browse = new Subject<boolean>();

  showBrowse() {
    this.main.next(false);
    this.browse.next(true);
  }

  showMain() {
    this.main.next(true);
    this.browse.next(false);
  }
}
