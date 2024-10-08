import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeCreationComponent } from './recipe-creation/recipe-creation.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'recipes/create', component: RecipeCreationComponent },
    { path: 'recipes/details', component: RecipeDetailsComponent },
];
