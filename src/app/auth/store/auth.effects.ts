import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";

import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(
    new Date().getTime() + +expiresIn * 1000
  );

  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticationSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknown error occured!';

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticationFail(errorMessage));
  }

  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'Email already exists';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'You are not allowed to access';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage = 'Please try again later';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Wrong password';
      break;
    case 'USER_DISABLED':
      errorMessage = 'Please enter a valid user';
      break;

    default:
      break;
  }
  return of(new AuthActions.AuthenticationFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSignUp = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
        environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
          return handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        }),
        catchError( errorResponse => {
          return handleError(errorResponse);
        })
      )
    })
  ), { dispatch: false });

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            );
          }),
          catchError( errorResponse => {
            return handleError(errorResponse);
          })
        );
      }),
  ), { dispatch: false});

  authRedirect = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATION_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticationSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  ), { dispatch: false });

  authLogout = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  ), { dispatch: false });

  authAutoLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return { type: 'DUMMY' };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if(loadedUser.token) {
        //this.userSubject.next(loadedUser);
        const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();

        this.authService.setLogoutTimer(expirationDuration);

        return new AuthActions.AuthenticationSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
        // this.autoLogout(expirationDuration);
      }
      return { type: 'DUMMY' };
    })
  ), { dispatch: false });

  constructor (
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
