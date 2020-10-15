import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../../shared/services/firebase.service";
import {Movie} from "../../../shared/models/movie.model";

declare global {
  interface Array<T> {
    stringCount(): Array<T>
  }
}

/**
 * Returns a new array of arrays of each equivalent string in original array.
 * Example: ['Hello','Hello','Goodbye','Hello','Goodbye','Goodbye'] => [['Hello','Hello','Hello']['Goodbye','Goodbye','Goodbye']]
 */

Array.prototype.stringCount = function (){
  this.sort();
  const A = []
  let I = 0;
  this.forEach((e, ind) => {
    if(typeof e === 'string')
      if(ind === 0){
        A.push([])
        A[I].push(e)
      }else if(this[ind] === this[ind-1]){
        A[I].push(e)
      }else {
        A.push([])
        I++
        A[I].push(e)
      }
    else
      throw new Error('elements of array must be of type string');
  })
  return A;
}

interface Category {
  category: string;
  count: number
}

@Component({
  selector: 'app-browse-sidebar',
  templateUrl: './browse-sidebar.component.html',
  styleUrls: ['./browse-sidebar.component.scss']
})
export class BrowseSidebarComponent implements OnInit{

  categories: Category[]

  constructor(private fbService: FirebaseService) {
  }

  ngOnInit(): void {
    if(this.fbService.fbMovies.length)
      this.onSetCategories(this.fbService.fbMovies)
    else
      this.fbService.moviesLoaded.subscribe(movies => {
        this.onSetCategories(movies);
      })
  }

  onSetCategories(movies: {[p: string]: Movie}[]){
    const catArray = movies
      .map(movie => movie[Object.keys(movie)[0]].category)
      .stringCount();
    this.categories = catArray.map(cat => ({category: cat[0], count: cat.length}))
  }

  onCategorySelected(category: string){
    this.fbService.filterMovies(category);
  }

  onClearFilters(){
    this.fbService.clearFilter();
  }
}
