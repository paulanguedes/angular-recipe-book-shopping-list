import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from './../recipes/recipe.service';
import { Recipe } from   '../recipes/recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
// import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
    // private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      'https://angular-recipe-book-9c6f3-default-rtdb.firebaseio.com/recipes.json',
      recipes
    ).subscribe(response => {
      console.log(response);

    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(
      'https://angular-recipe-book-9c6f3-default-rtdb.firebaseio.com/recipes.json'
    )
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        // this.recipeService.setRecipes(recipes);
        this.store.dispatch(new RecipesActions.SetRecipes(recipes));
      })
    )
  }
}
