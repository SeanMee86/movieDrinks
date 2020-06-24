import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  shouldShowSpinner = new Subject<boolean>();

  showSpinner() {
    this.shouldShowSpinner.next(true);
  }

  hideSpinner() {
    this.shouldShowSpinner.next(false);
  }
}
