import { Component, inject } from '@angular/core';
import { Recipe } from '../core/model/recipe';
import { RecipesService } from '../core/services/recipes.service';
import { CommonModule } from '@angular/common';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbRatingModule
  ],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent {
  recipes!: Recipe[];
  private service = inject(RecipesService);

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;

    this.service.getRecipes().pipe(takeUntilDestroyed()).subscribe(results => {
      this.recipes = results;
    })
  }
}
