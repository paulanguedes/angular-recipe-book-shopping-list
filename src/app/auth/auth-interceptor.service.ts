import { Injectable } from "@angular/core";
import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from "@angular/common/http";
import { exhaustMap, map, take } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      map(authState => {
        return authState.user;
      }),
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        const updatedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        })

        return next.handle(updatedReq);
      }));

  }
}
