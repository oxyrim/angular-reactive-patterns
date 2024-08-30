import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Recipe } from '../core/model/recipe.model';
import { RECIPE_TAGS } from '../core/model/tags';
import { RecipesService } from '../core/services/recipes.service';
import { catchError, concatMap, exhaustMap, finalize, switchMap, tap } from 'rxjs/operators'
import { BehaviorSubject, Subject, forkJoin, of } from 'rxjs';
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
  private uploadFilesSubject$ = new BehaviorSubject<File[]>([]);
  selectedFiles!: File[];
  uploadProgress: number = 0;
  counter: number = 0;
  tags = RECIPE_TAGS;

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

  private saveClick = new Subject<Boolean>();
  private saveRecipe$ = this.service.saveRecipe(<Recipe>this.recipeForm.value);

  valueChanges$ = this.recipeForm.valueChanges.pipe(
    concatMap(formValue => this.service.saveRecipe(<Recipe>formValue)),
    catchError(errors => of(errors)),
    tap(result => this.saveSuccess(result))
  );

  saveClick$ = this.saveClick.pipe(exhaustMap(() => this.saveRecipe$));
  saveRecipe() {
    this.saveClick.next(true);
  }

  saveSuccess(_result: Recipe) {
    console.log('Saved Successfully');
  }

  onFileSelected(e: Event): void {
    this.counter = 0;
    this.uploadProgress = 0;
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.uploadFilesSubject$.next(this.selectedFiles);
    }
  }

  uploadRecipeImages$ = this.uploadFilesSubject$.pipe(
    switchMap(filesToUpload =>
      forkJoin(
        filesToUpload.map((file: File) =>
          this.service.upload(this.recipeForm.value.id, file).pipe(
            catchError(errors => of(errors)),
            finalize(() => this.calculatePercentage(
              ++this.counter, filesToUpload.length
            ))
          )
        )
      )
    )
  )

  private calculatePercentage(completed: number, totalRequests: number) {
    this.uploadProgress = Math.round((completed / totalRequests)
      * 100)
  }

}
