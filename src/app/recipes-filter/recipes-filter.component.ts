import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Recipe } from '../core/model/recipe.model';
import { RecipesService } from '../core/services/recipes.service';

@Component({
  selector: 'app-recipes-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recipes-filter.component.html',
  styleUrl: './recipes-filter.component.scss'
})
export class RecipesFilterComponent {

  private service = inject(RecipesService);
  private formBuilder = inject(FormBuilder);

  recipeForm = this.formBuilder.group<Partial<Recipe>>({
    title: '',
    category: '',
    ingredients: '',
    tags: '',
    prepTime: undefined,
    cookTime: undefined,
  })

  filterResults() {
    this.service.updateFilter(<Recipe>this.recipeForm.value);
  }

  clearFilter() {
    this.service.updateFilter(<Recipe>{ title: '' });
    this.recipeForm.reset();
  }
}
