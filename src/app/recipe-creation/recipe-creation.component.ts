import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Recipe } from '../core/model/recipe';
import { RECIPE_TAGS } from '../core/model/tags';
import { RecipesService } from '../core/services/recipes.service';
import { catchError, concatMap, tap } from 'rxjs/operators'
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-creation.component.html',
  styleUrl: './recipe-creation.component.scss'
})
export class RecipeCreationComponent {
  private fb = inject(FormBuilder);
  private service = inject(RecipesService);

  recipeForm = this.fb.group<Partial<Recipe>>({
    id: Math.floor(1000 + Math.random() * 9000),
    title: '',
    ingredients: '',
    tags: '',
    imageUrl: '',
    cookTime: undefined,
    yield: 0,
    prepTime: undefined,
    steps: '',
  });
  tags = RECIPE_TAGS;

  valueChanges$ = this.recipeForm.valueChanges.pipe(
    concatMap(formValue => this.service.saveRecipe(<Recipe>formValue)),
    catchError(errors => of(errors)),
    tap(result => this.saveSuccess(result))
  );

  saveSuccess(_result: Recipe) {
    console.log('Saved Successfully');
  }

}
