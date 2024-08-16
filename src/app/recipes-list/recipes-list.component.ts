import { Component, inject } from '@angular/core';
import { RecipesService } from '../core/services/recipes.service';
import { CommonModule } from '@angular/common';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

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
  private service = inject(RecipesService);
  recipes$ = this.service.recipes$;

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }
}
