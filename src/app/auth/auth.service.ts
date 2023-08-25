import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import { UserModel } from './user.model';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user = new BehaviorSubject<UserModel>(null);
  public tokenExpirationTimer = null;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseAPIKey,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handlingError),
        tap((respone) => {
          this.handleUser(
            respone.email,
            respone.localId,
            respone.idToken,
            +respone.expiresIn
          );
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handlingError),
        tap((respone) => {
          this.handleUser(
            respone.email,
            respone.localId,
            respone.idToken,
            +respone.expiresIn
          );
        })
      );
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const loadedData = JSON.parse(localStorage.getItem('userData'));
    if (!loadedData) return;

    const loadedUser = new UserModel(
      loadedData.email,
      loadedData.password,
      loadedData._token,
      new Date(loadedData._tokenExperationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const reminderDate =
        new Date(loadedData._tokenExperationDate).getTime() -
        new Date().getTime();
      this.autoLogout(reminderDate * 1000);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  handleUser(
    userEmail: string,
    userId: string,
    userToken: string,
    experationDate: number
  ) {
    const tokenExperationDate = new Date(
      new Date().getTime() + experationDate * 1000
    );
    const user = new UserModel(
      userEmail,
      userId,
      userToken,
      tokenExperationDate
    );

    this.user.next(user);
    this.autoLogout(experationDate * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handlingError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An anknown error occurend!';
    console.log(errorRes, 'ressErrr');

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exest alaredy!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password not found';
        break;
    }
    return throwError(errorMessage);
  }
}
