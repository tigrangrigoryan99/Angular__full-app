import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingridient } from '../shared/ingridient.model';
import { ShoppingService } from '../shopping-list/shopping.service';
import { Recipe } from './recipes.model';

@Injectable({ providedIn: 'root' })
export class RecipesService {
  recipesChanged = new Subject<Recipe[]>();

//   private recipes: Recipe[] = [
//     new Recipe(
//       'Healthy roast recipes',
//       'Try roast chicken, lamb, pork, beef and turkey.',
//       `https://a.cdn-hotels.com/gdcs/production0/d1513/35c1c89e-408c-4449-9abe-f109068f40c0.jpg?impolicy=fcrop&w=1600&h=1066&q=medium`,
//       [new Ingridient('Meet', 1), new Ingridient('French Frise', 20)]
//     ),
//     new Recipe(
//       'Healthy Easter lamb',
//       'Try a lighter take on roast  healthy Easter. ',
//       `https://a.cdn-hotels.com/gdcs/production5/d888/1b61cd53-b152-4c82-b438-be4d52e5d918.jpg?impolicy=fcrop&w=1600&h=1066&q=medium`,
//       [new Ingridient('Buns', 2), new Ingridient('Bred', 1)]
//     ),
//   ];

  private recipes: Recipe[] = [];

  constructor(private shoppService: ShoppingService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngToShopList(ingridient: Ingridient[]) {
    this.shoppService.addRecipesInIngr(ingridient);
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  updateRecipe(index: number, updatesRecipe: Recipe) {
    this.recipes[index] = updatesRecipe;
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
