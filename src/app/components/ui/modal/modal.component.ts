import { Component, OnInit } from '@angular/core';
import {UiService} from '../../../shared/services/ui.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(private uiService: UiService) { }

  ngOnInit(): void {
  }

  onCreateGame() {
    this.uiService.sendMovieToFB().subscribe(
      _ => {
        this.uiService.hideModal();
        this.uiService.hideSpinner();
      }
    );
  }
}
