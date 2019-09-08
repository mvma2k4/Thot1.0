import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/core/authentication/credentials.service';

import { Logger } from '../core/logger.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '@app/core';

const log = new Logger('providerService');

export interface IDebitNoteModel {
  uuid: string;
  name: string;
  address: string;
  phone: string;
}

@Injectable()
export class DebitNotesService {
  constructor(private credentialsService: CredentialsService, private httpService: HttpClient) {}

  findAll(): Observable<any | IDebitNoteModel[]> {
    let values: IDebitNoteModel[] = new Array();
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
          value.forEach((element: IDebitNoteModel) => {
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

  addDebitNote(counter: IDebitNoteModel): Observable<any | IResponse> {
    let response = this.httpService
      .post('/v1/debitnotes/', counter, {
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

  updateDebitNote(counter: IDebitNoteModel): Observable<any | IResponse> {
    let response = this.httpService
      .put('/v1/debitnotes', counter, {
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

  removeDebitNote(counter: IDebitNoteModel): Observable<any | IResponse> {
    let response = this.httpService
      .delete('/v1/debitnotes/' + counter.uuid, {
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
