import { Component, inject } from '@angular/core';
import { SharedDataService } from '../core/services/shared-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent {
  private sharedService = inject(SharedDataService);
  selectedRecipe$ = this.sharedService.selectedRecipe$;

}
