import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(
  private http: HttpClient
) { }

signup(email: string, password: string) {
  return this.http.post<AuthResponseData>(
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDUD2g5WLwPz1bfUXpn8T6wQ5L1Jx-V7q4',
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
  )
}

}
