import { Subject } from 'rxjs';

import { Ingridient } from '../shared/ingridient.model';

export class ShoppingService {
  ingredientsChanged = new Subject<Ingridient[]>();
  startedEditing = new Subject<number>();

  private ingridients: Ingridient[] = [
    new Ingridient('Chees', 2),
    new Ingridient('Bred', 0.5),
    new Ingridient('Meet', 0.7),
    new Ingridient('Tomatoes', 3),
  ];

  public getIngridients() {
    return this.ingridients.slice();
  }

  public getIngredient(index: number) {
    return this.ingridients[index];
  }

  public addIngridient(ing: Ingridient) {
    this.ingridients.push(ing);
    this.ingredientsChanged.next(this.ingridients.slice());
  }

  public addRecipesInIngr(ing: Ingridient[]) {
    this.ingridients.push(...ing);
    this.ingredientsChanged.next(this.ingridients.slice());
  }

  public updateIngredient(index: number, newIngredient: Ingridient) {
    this.ingridients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingridients.slice());
  }

  public deleteingredient(index: number) {
    this.ingridients.splice(index, 1);
    this.ingredientsChanged.next(this.ingridients.slice());
  }
}
