import {
  Component,
  Input
} from '@angular/core';

import { Movie } from '../../../shared/models/movie.model';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent {
  @Input()
  movie: Movie;
}
