import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, share, switchMap, timer } from 'rxjs';
import { Recipe } from '../model/recipe';
const BASE_PATH = environment.basePath;

const REFRESH_INTERVAL = 30000;
const timer$ = timer(0, REFRESH_INTERVAL);

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private http = inject(HttpClient);

  private filterRecipeSubject$ = new BehaviorSubject<Partial<Recipe>>({ title: '' });
  filterRecipeAction$ = this.filterRecipeSubject$.asObservable();

  // shareReplay
  // recipes$ = timer$.pipe(
  //   switchMap(_ => this.http.get<Recipe[]>(`${BASE_PATH}/recipes`)),
  //   shareReplay({ bufferSize: 1, refCount: true }),
  // )

  // share RxJs 7
  recipes$ = timer$.pipe(
    switchMap(_ =>
      this.http.get<Recipe[]>(`${BASE_PATH}/recipes`)),
    share({
      connector: () => new ReplaySubject(1),
      resetOnRefCountZero: true,
      resetOnComplete: true,
      resetOnError: true
    }))

  updateFilter(criteria: Recipe) {
    this.filterRecipeSubject$.next(criteria);
  }

  saveRecipe(formValue: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${BASE_PATH}/recipes/save`, formValue);
  }
}


