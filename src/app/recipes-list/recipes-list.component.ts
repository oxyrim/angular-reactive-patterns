import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RecipesService } from '../core/services/recipes.service';
import { CommonModule } from '@angular/common';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../core/model/recipe';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbRatingModule,
  ],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent {
  private service = inject(RecipesService);

  recipes$ = this.service.recipes$;
  filterRecipeAction$ = this.service.filterRecipeAction$;

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

  filteredRecipes$ = combineLatest([this.recipes$, this.filterRecipeAction$])
    .pipe(map(([recipes, filter]: [Recipe[], Partial<Recipe>]) => {
      const filterTitle = filter?.title?.toLocaleLowerCase() ?? '';
      return recipes?.filter(recipe =>
        recipe?.title?.toLowerCase().includes(filterTitle));
    }))
}
