import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RecipesService } from '../core/services/recipes.service';
import { CommonModule } from '@angular/common';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { Recipe } from '../core/model/recipe.model';
import { SharedDataService } from '../core/services/shared-data.service';
import { Router } from '@angular/router';
import { RealTimeService } from '../core/services/real-time.service';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, NgbRatingModule],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesListComponent {
  private service = inject(RecipesService);
  private sharedDataService = inject(SharedDataService);
  private realTimeService = inject(RealTimeService);
  private router = inject(Router);

  // recipes$ = this.service.recipes$;
  recipes$ = combineLatest([
    this.service.recipes$,
    this.realTimeService.message$,
  ]).pipe(
    scan((acc: Recipe[], [recipes, newRecipes]: [Recipe[], Recipe[]]) => {
      return acc.length === 0 && newRecipes.length === 0
        ? recipes
        : [...acc, ...newRecipes];
    }, [])
  );

  filterRecipeAction$ = this.service.filterRecipeAction$;

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

  filteredRecipes$ = combineLatest([
    this.recipes$,
    this.filterRecipeAction$,
  ]).pipe(
    map(([recipes, filter]: [Recipe[], Partial<Recipe>]) => {
      const filterTitle = filter?.title?.toLocaleLowerCase() ?? '';
      return recipes?.filter((recipe) =>
        recipe?.title?.toLowerCase().includes(filterTitle)
      );
    })
  );

  viewRecipe(recipe: Recipe) {
    this.sharedDataService.updateSelectedRecipe(recipe);
    this.router.navigate(['/recipes/details']);
  }
}
