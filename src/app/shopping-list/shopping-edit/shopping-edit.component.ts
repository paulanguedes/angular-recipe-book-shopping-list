import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { ShoppingListService } from './../shopping-list.service';
import { Ingredient } from './../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('formRef', { static: false }) editShoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService
  ) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editedItemIndex = index;
      this.editMode = true;
      this.editedItem = this.shoppingListService.getIngredient(index);
      this.editShoppingListForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    })
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngridient = new Ingredient(value.name, value.amount);
    this.shoppingListService.addIngredient(newIngridient);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
