import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/core/authentication/credentials.service';

import { Logger } from '../core/logger.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '@app/core';

const log = new Logger('operatorService');

export interface IOperatorModel {
  uuid: string;
  name: string;
  address: string;
  phone: string;
}

@Injectable()
export class OperatorsService {
  constructor(private credentialsService: CredentialsService, private httpService: HttpClient) {}

  findAll(): Observable<any | IOperatorModel[]> {
    let values: IOperatorModel[] = new Array();
    let response = this.httpService
      .get('/v1/operators/', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          log.debug(value);
          value.forEach((element: IOperatorModel) => {
            values.push({
              uuid: element.uuid,
              name: element.name,
              address: element.address,
              phone: element.phone
            });
          });

          return values;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  addOperator(counter: IOperatorModel): Observable<any | IResponse> {
    let response = this.httpService
      .post('/v1/operators/', counter, {
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

  updateOperator(counter: IOperatorModel): Observable<any | IResponse> {
    let response = this.httpService
      .put('/v1/operators', counter, {
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

  removeOperator(counter: IOperatorModel): Observable<any | IResponse> {
    let response = this.httpService
      .delete('/v1/operators/' + counter.uuid, {
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
