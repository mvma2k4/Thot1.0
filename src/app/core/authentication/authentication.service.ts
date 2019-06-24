import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Logger } from './../logger.service';
import { Credentials, CredentialsService } from './credentials.service';
// import { HttpService } from './../http/http.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

const log = new Logger('authenticationService');

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

export interface InvalidCredentials {
  // Customize received credentials here
  status: Number;
  message: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private httpService: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<any | Credentials> {
    // Replace by proper authentication call
    let data = {
      username: context.username,
      token: '1234'
    };

    let response = this.httpService
      .post(
        '/auth/login/',
        { email: context.username, password: context.password },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'json'
        }
      )
      .pipe(
        map((value: any) => {
          // log.debug(value)
          if (value.status == 200) {
            data.token = value.token;
            this.credentialsService.setCredentials(data, context.remember);
            return <Credentials>data;
          } else {
            return <InvalidCredentials>value;
          }
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
