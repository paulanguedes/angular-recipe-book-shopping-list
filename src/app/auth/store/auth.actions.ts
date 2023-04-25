import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const AUTHENTICATION_FAIL = '[Auth] Authentication Fail';
export const AUTHENTICATION_SUCCESS = '[Auth] Authentication Success';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Sign up Start';
export const CLEAR_ERROR = '[Auth] Clear Error';

export class AuthenticationSuccess implements Action {
  readonly type = AUTHENTICATION_SUCCESS;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(
    public payload: {
      email: string,
      password: string
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;

  constructor() {}
}

export class AuthenticationFail implements Action {
  readonly type = AUTHENTICATION_FAIL;

  constructor(
    public payload: string
  ) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(
    public payload: {
      email: string,
      password: string
    }
  ) {}
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticationSuccess
  | AutoLogin
  | Logout
  | LoginStart
  | SignupStart
  | ClearError
  | AuthenticationFail;
