import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";

import { DataStorageService } from './../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSubscription: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
