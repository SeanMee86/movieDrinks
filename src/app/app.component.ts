import { Component, OnInit } from '@angular/core';
import { ModalService } from './shared/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  showModal: boolean;
  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.shouldShowModal.subscribe(
      value => {
        this.showModal = value;
      }
    );
  }
}
