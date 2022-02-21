import { Component } from '@angular/core';

type Route = {
  link: string;
  label: string;
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isCollapsed = true;
  routes: Route[] = [
    {
      link: 'movies',
      label: 'Find a Movie'
    },
    {
      link: 'browse',
      label: 'Browse Games'
    }
  ];
}
