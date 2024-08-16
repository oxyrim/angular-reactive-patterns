import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { Recipe } from '../model/recipe';
const BASE_PATH = environment.basePath;

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private http = inject(HttpClient);
  recipes$ = this.http.get<Recipe[]>(`${BASE_PATH}/recipes`)
    .pipe(catchError(() => of([])));
}
