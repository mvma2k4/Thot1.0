import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/core/authentication/credentials.service';

import { Logger } from '../core/logger.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '@app/core';

const log = new Logger('clientService');

export interface IClientModel {
  uuid: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

@Injectable()
export class ClientsService {
  constructor(private credentialsService: CredentialsService, private httpService: HttpClient) {}

  findAll(): Observable<any | IClientModel[]> {
    let values: IClientModel[] = new Array();
    let response = this.httpService
      .get('/v1/clients/', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          log.debug(value);
          value.forEach((element: IClientModel) => {
            values.push({
              uuid: element.uuid,
              name: element.name,
              email: element.email,
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

  findOne(id: string): Observable<any | IClientModel> {
    let result: IClientModel;
    let response = this.httpService
      .get('/v1/clients/' + id, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          log.debug(value);
          result = value;
          return result;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  addClient(counter: IClientModel): Observable<any | IResponse> {
    let response = this.httpService
      .post('/v1/clients/', counter, {
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

  updateClient(counter: IClientModel): Observable<any | IResponse> {
    let response = this.httpService
      .put('/v1/clients', counter, {
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

  removeClient(counter: IClientModel): Observable<any | IResponse> {
    let response = this.httpService
      .delete('/v1/clients/' + counter.uuid, {
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
