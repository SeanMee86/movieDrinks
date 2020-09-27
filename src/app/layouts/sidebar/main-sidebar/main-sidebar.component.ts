import { Component } from '@angular/core';
import {FirebaseService} from "../../../shared/services/firebase.service";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss']
})
export class MainSidebarComponent {
  constructor(private fbService: FirebaseService) {
  }

  getCategories(){
    this.fbService.getCategories().subscribe(res => {
      console.log(res);
    })
  }
}
