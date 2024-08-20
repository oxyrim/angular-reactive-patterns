import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { Recipe } from '../model/recipe';
const BASE_PATH = environment.basePath;

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private http = inject(HttpClient);

  private filterRecipeSubject$ = new BehaviorSubject<Partial<Recipe>>({ title: '' });
  filterRecipeAction$ = this.filterRecipeSubject$.asObservable();

  recipes$ = this.http.get<Recipe[]>(`${BASE_PATH}/recipes`)
    .pipe(catchError(() => of([])));

  updateFilter(criteria: Recipe) {
    this.filterRecipeSubject$.next(criteria);
  }

  saveRecipe(formValue: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${BASE_PATH}/recipes/save`, formValue);
  }
}
