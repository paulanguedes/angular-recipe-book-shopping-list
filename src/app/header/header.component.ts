import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent {
  @Output() pageSelected = new EventEmitter<string>();

  onSelect(pageSelection: string) {
    this.pageSelected.emit(pageSelection);
  }
}
