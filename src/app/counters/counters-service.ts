import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/core/authentication/credentials.service';

import { Logger } from '../core/logger.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '@app/core';

const log = new Logger('countersService');

export interface ICounter {
  uuid: string;
  name: string;
  email: string;
  client_uuid: string;
  clientName: string;
}

@Injectable()
export class CountersService {
  constructor(private credentialsService: CredentialsService, private httpService: HttpClient) {}

  findAll(): Observable<any | ICounter[]> {
    let values: ICounter[] = new Array();
    let response = this.httpService
      .get('/v1/counters/', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          log.debug(value);
          value.forEach((element: ICounter) => {
            values.push({
              uuid: element.uuid,
              name: element.name,
              email: element.email,
              client_uuid: element.client_uuid,
              clientName: ''
            });
          });

          return values;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  findAllByClient(client_uuid: string): Observable<any | ICounter[]> {
    let values: ICounter[] = new Array();
    let response = this.httpService
      .get('/v1/counters/client/' + client_uuid, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          log.debug(value);
          value.forEach((element: ICounter) => {
            values.push({
              uuid: element.uuid,
              name: element.name,
              email: element.email,
              client_uuid: element.client_uuid,
              clientName: ''
            });
          });

          return values;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  addCounter(counter: ICounter): Observable<any | IResponse> {
    let response = this.httpService
      .post('/v1/counters/', counter, {
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

  updateCounter(counter: ICounter): Observable<any | IResponse> {
    let response = this.httpService
      .put('/v1/counters', counter, {
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

  removeCounter(counter: ICounter): Observable<any | IResponse> {
    let response = this.httpService
      .delete('/v1/counters/' + counter.uuid, {
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
