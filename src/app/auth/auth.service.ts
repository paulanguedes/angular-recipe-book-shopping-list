import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { BehaviorSubject, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
// import { environment } from 'src/environments/environment';
// import { User } from './user.model';

// export interface AuthResponseData {
//   idToken: string,
//   email: string,
//   refreshToken: string,
//   expiresIn: string,
//   localId: string,
//   registered?: boolean
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //userSubject = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    // private http: HttpClient,
    // private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  };

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  };

  // signup(email: string, password: string) {
  //   return this.http.post<AuthResponseData>(
  //     'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
  //     environment.firebaseAPIKey,
  //     {
  //       email: email,
  //       password: password,
  //       returnSecureToken: true
  //     }
  //   ).pipe(catchError(this.handleError), tap(responseData => {
  //     this.handleAuthentication(
  //       responseData.email,
  //       responseData.localId,
  //       responseData.idToken,
  //       +responseData.expiresIn
  //     )
  //   }));
  // }

  // login(email: string, password: string) {
  //   return this.http.post<AuthResponseData>(
  //     'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  //     environment.firebaseAPIKey,
  //     {
  //       email: email,
  //       password: password,
  //       returnSecureToken: true
  //     }
  //   ).pipe(catchError(this.handleError), tap(responseData => {
  //     this.handleAuthentication(
  //       responseData.email,
  //       responseData.localId,
  //       responseData.idToken,
  //       +responseData.expiresIn
  //     )
  //   }));
  // }

  // logout() {
  //   // this.userSubject.next(null);
  //   this.store.dispatch(new AuthActions.Logout());

  //   // this.router.navigate(['/auth']);

  //   localStorage.removeItem('userData');
  //   if (this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer);
  //   }
  //   this.tokenExpirationTimer = null;
  // }

  // autoLogout(expirationDuration: number) {
  //   this.tokenExpirationTimer = setTimeout(() => {
  //     this.logout();
  //   }, expirationDuration);
  // }

  // autoLogin() {
  //   const userData: {
  //     email: string,
  //     id: string,
  //     _token: string,
  //     _tokenExpirationDate: string
  //   } = JSON.parse(localStorage.getItem('userData'));

  //   if (!userData) {
  //     return;
  //   }

  //   const loadedUser = new User(
  //     userData.email,
  //     userData.id,
  //     userData._token,
  //     new Date(userData._tokenExpirationDate)
  //   );

  //   if(loadedUser.token) {
  //     //this.userSubject.next(loadedUser);
  //     this.store.dispatch(new AuthActions.AuthenticationSuccess({
  //       email: loadedUser.email,
  //       userId: loadedUser.id,
  //       token: loadedUser.token,
  //       expirationDate: new Date(userData._tokenExpirationDate)
  //     }));

  //     const expirationDuration =
  //     new Date(userData._tokenExpirationDate).getTime() -
  //     new Date().getTime();
  //     this.autoLogout(expirationDuration);
  //   }
  // }

  // private handleAuthentication(
  //   email: string,
  //   userId: string,
  //   token: string,
  //   expiresIn: number
  // ) {
  //   const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  //     const user = new User(
  //       email,
  //       userId,
  //       token,
  //       expirationDate
  //     );

  //     //this.userSubject.next(user);
  //     this.store.dispatch(new AuthActions.AuthenticationSuccess({
  //       email: email,
  //       userId: userId,
  //       token: token,
  //       expirationDate: expirationDate
  //     }));

  //     this.autoLogout(expiresIn * 1000);
  //     localStorage.setItem('userData', JSON.stringify(user));
  // }

  // private handleError(errorResponse: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occured!';

  //   if (!errorResponse.error || !errorResponse.error.error) {
  //     return throwError(errorMessage);
  //   }

  //   switch (errorResponse.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'Email already exists';
  //       break;
  //     case 'OPERATION_NOT_ALLOWED':
  //       errorMessage = 'You are not allowed to access';
  //       break;
  //     case 'TOO_MANY_ATTEMPTS_TRY_LATER':
  //       errorMessage = 'Please try again later';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'This email does not exist';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'Wrong password';
  //       break;
  //     case 'USER_DISABLED':
  //       errorMessage = 'Please enter a valid user';
  //       break;

  //     default:
  //       break;
  //   }

  //   return throwError(errorMessage);
  // }

}
