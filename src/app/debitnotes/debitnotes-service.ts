import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/core/authentication/credentials.service';

import { Logger } from '../core/logger.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '@app/core';

const log = new Logger('debitnotesService');

export interface ICounter {
  uuid: string;
  name: string;
  address: string;
  phone: string;
  perc: number;
}

@Injectable()
export class DebitnoteService {
  constructor(private credentialsService: CredentialsService, private httpService: HttpClient) {}

  findAll(): Observable<any | ICounter[]> {
    let values: ICounter[] = new Array();
    let response = this.httpService
      .get('/v1/debitnotes/', {
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
              address: element.address,
              phone: element.phone,
              perc: element.perc
            });
          });

          return values;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  addCounter(debitnote: ICounter): Observable<any | IResponse> {
    let response = this.httpService
      .post('/v1/debitnotes/', debitnote, {
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

  updateCounter(debitnote: ICounter): Observable<any | IResponse> {
    let response = this.httpService
      .put('/v1/debitnotes', debitnote, {
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

  removeCounter(debitnote: ICounter): Observable<any | IResponse> {
    let response = this.httpService
      .delete('/v1/debitnotes/' + debitnote.uuid, {
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
