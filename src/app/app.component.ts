import { Component, OnInit } from '@angular/core';
import { UiService } from './shared/services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  showModal: boolean;
  constructor(private uiService: UiService) { }

  ngOnInit(): void {
    this.uiService.shouldShowModal.subscribe(
      value => {
        this.showModal = value;
      }
    );
  }
}
