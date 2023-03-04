import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppinglistActions from "./shopping-list.actions";

const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Oranges', 13)
  ]
};

export function shoppingListReducer(
    state = initialState,
    action: ShoppinglistActions.AddIngredient
) {

  switch (action.type) {
    case ShoppinglistActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };

    default:
      break;
  }
}
