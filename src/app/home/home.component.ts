import { Component } from '@angular/core';
import { RecipesListComponent } from '../recipes-list/recipes-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecipesListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
