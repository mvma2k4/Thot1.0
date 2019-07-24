import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/core/authentication/credentials.service';

import { Logger } from '../core/logger.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

const log = new Logger('usersService');

export interface IUserModel {
  email: string;
  password: string;
  fullname: string;
}

@Injectable()
export class UsersService {
  constructor(private credentialsService: CredentialsService, private httpService: HttpClient) {}

  findAll(): Observable<any | IUserModel[]> {
    let values: IUserModel[] = new Array();
    let response = this.httpService
      .get('/v1/users/', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          log.debug(value);
          value.forEach((element: IUserModel) => {
            values.push({
              email: element.email,
              password: element.password,
              fullname: element.fullname
            });
          });

          return values;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  addUser(user: IUserModel): Observable<any | IUserModel> {
    let response = this.httpService
      .post('/auth/signup/', user, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          return value;
        }),
        catchError((error: any) => error)
      );

    return response;
  }
}
