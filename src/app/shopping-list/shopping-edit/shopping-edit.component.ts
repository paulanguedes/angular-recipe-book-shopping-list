import { Ingredient } from './../../shared/ingredient.model';
import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;

  @Output() ingridientAdded = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit(): void {
  }

  onAddItem() {
    const ingridientName = this.nameInputRef.nativeElement.value;
    const ingridientAmount = this.amountInputRef.nativeElement.value;
    const newIngridient = new Ingredient(ingridientName, ingridientAmount);

    this.ingridientAdded.emit(newIngridient);
  }

}
