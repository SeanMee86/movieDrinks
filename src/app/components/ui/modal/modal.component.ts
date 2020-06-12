import { Component, OnInit } from '@angular/core';
import {UiService} from '../../../shared/services/ui.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(
    private uiService: UiService,
    private router: Router
  ) { }

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

  onCancelGame() {
    this.router.navigate(['/search']);
    this.uiService.hideModal();
  }
}
