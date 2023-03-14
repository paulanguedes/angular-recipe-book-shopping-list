import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Ingredient } from './../shared/ingredient.model';
import { Recipe } from './recipe.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Salada de macarrão',
  //     'Uma refrescante salada para o verão',
  //     'https://claudia.abril.com.br/wp-content/uploads/2020/02/receita-salada-macarrao-3.jpg?quality=85&strip=info',
  //     [
  //       new Ingredient('maço de brócolis', 1),
  //       new Ingredient('xícara (chá) de vinagre', 1),
  //       new Ingredient('xícara (chá) de queijo de minas em cubos', 1),
  //       new Ingredient('dente de alho picado', 1),
  //       new Ingredient('xícara (chá) de cebolinha-verde', 1)
  //     ]),
  //   new Recipe(
  //     'Feijoada',
  //     'Receita fácil e light do prato mais brasileiro que existe',
  //     'https://cdn.panelinha.com.br/receita/1588270905274-39_Panelinha_12_02_200635.jpg',
  //     [
  //       new Ingredient('quilo de costela de porco salgada', 1),
  //       new Ingredient('quilo de carne-seca', 1),
  //       new Ingredient('quilo de lombo de porco salgado', 1),
  //       new Ingredient('quilo de feijão', 1)
  //     ])
  // ];

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
    ) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    //this.shoppingListService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

}
