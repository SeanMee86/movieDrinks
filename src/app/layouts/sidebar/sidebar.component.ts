import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SidebarService} from '../../shared/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  showMain = true;
  showBrowse = false;

  constructor(
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.sidebarService.main.subscribe(
      value => {
        this.showMain = value;
        this.cdr.detectChanges();
      }
    );
    this.sidebarService.browse.subscribe(
      value => {
        this.showBrowse = value;
        this.cdr.detectChanges();
      }
    );
  }
}
