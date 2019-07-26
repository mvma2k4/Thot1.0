import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/core/authentication/credentials.service';

import { Logger } from '../core/logger.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '@app/core';

const log = new Logger('usersService');

export interface IUserModel {
  uuid: string;
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
              uuid: element.uuid,
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

  addUser(user: IUserModel): Observable<any | IResponse> {
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
          return <IResponse>value;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  updateUser(user: IUserModel): Observable<any | IResponse> {
    let response = this.httpService
      .put('/v1/users', user, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          return <IResponse>value;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  removeUser(user: IUserModel): Observable<any | IResponse> {
    let response = this.httpService
      .delete('/v1/users/' + user.uuid, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          return <IResponse>value;
        }),
        catchError((error: any) => error)
      );

    return response;
  }
}
