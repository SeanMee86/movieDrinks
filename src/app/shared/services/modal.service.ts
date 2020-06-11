import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  shouldShowModal = new Subject<boolean>();

  constructor() { }

  showModal() {
    this.shouldShowModal.next(true);
  }

  hideModal() {
    this.shouldShowModal.next(false);
  }
}
