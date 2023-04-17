import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";

import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthEffects {
  authSignUp = createEffect(() => this.actions$.pipe());

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
            map(resData => {
              const expirationDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              return new AuthActions.AuthenticationSuccess({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate
              });
            }),
            catchError( errorResponse => {
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
          })
        );
      }),
    ), { dispatch: false}
  );

  authSuccess = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATION_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  ), { dispatch: false });

  constructor (
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
