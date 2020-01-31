import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/core/authentication/credentials.service';

import { Logger } from '../core/logger.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '@app/core';

const log = new Logger('service-infoService');

export interface IService_info {
  uuid: string;
  description: string;
  base_price: string;
  provider_uuid: string;
  providerName: string;
}

@Injectable()
export class ServiceInfoService {
  constructor(private credentialsService: CredentialsService, private httpService: HttpClient) {}

  findAll(): Observable<any | IService_info[]> {
    let values: IService_info[] = new Array();
    let response = this.httpService
      .get('/v1/service/', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          log.debug(value);
          value.forEach((element: IService_info) => {
            values.push({
              uuid: element.uuid,
              description: element.description,
              base_price: element.base_price,
              provider_uuid: element.provider_uuid,
              providerName: ''
            });
          });

          return values;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  findAllByProvider(provider_uuid: string): Observable<any | IService_info[]> {
    let values: IService_info[] = new Array();
    let response = this.httpService
      .get('/v1/service/provider/' + provider_uuid, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': this.credentialsService.credentials.token
        }),
        responseType: 'json'
      })
      .pipe(
        map((value: any) => {
          log.debug(value);
          value.forEach((element: IService_info) => {
            values.push({
              uuid: element.uuid,
              description: element.description,
              base_price: element.base_price,
              provider_uuid: element.provider_uuid,
              providerName: ''
            });
          });

          return values;
        }),
        catchError((error: any) => error)
      );

    return response;
  }

  addService(service: IService_info): Observable<any | IResponse> {
    let response = this.httpService
      .post('/v1/service/', service, {
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

  updateService(service: IService_info): Observable<any | IResponse> {
    let response = this.httpService
      .put('/v1/service', service, {
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

  removeService(service: IService_info): Observable<any | IResponse> {
    let response = this.httpService
      .delete('/v1/service/' + service.uuid, {
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
