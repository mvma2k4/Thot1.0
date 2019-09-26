import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { IDebitNoteModel, DebitNotesService } from '@app/debitnotes/debitnotes-service';
import { IClientModel, ClientsService } from '@app/clients/clients-service';
import { ICounter, CountersService } from '@app/counters/counters-service';
import { IProviderModel, ProvidersService } from '@app/providers/providers-service';
import { from } from 'rxjs';
import { element } from '@angular/core/src/render3';

const log = new Logger('AddDebitNote');
@Component({
  selector: 'Adddebitnote',
  templateUrl: 'adddebitnote.component.html',
  styleUrls: ['adddebitnote.component.scss']
})
export class AdddebitnoteComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoNotaDebito!: FormGroup;
  isLoading = false;
  data!: IDebitNoteModel;
  clients!: IClientModel[];
  counters!: ICounter[];
  providers!: IProviderModel[];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AdddebitnoteComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: IDebitNoteModel,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private debitnotesService: DebitNotesService,
    private clientsService: ClientsService,
    private countersService: CountersService,
    private providersService: ProvidersService
  ) {
    this.data = data;
    if (this.data) {
      this.createForm(this.data);
    } else {
      this.createForm(null);
    }
  }

  ngOnInit() {
    this.isLoading = true;
    const clients$ = this.clientsService.findAll();
    const providers$ = this.providersService.findAll();

    clients$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
          this.clients = values;
        },
        error => {
          log.debug(`Get Clients error: ${error}`);
        }
      );

    providers$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
          this.providers = values;
        },
        error => {
          log.debug(`Get Providers error: ${error}`);
        }
      );
  }

  getCounters(client_uuid: string) {
    this.isLoading = true;
    const counters$ = this.countersService.findAllByClient(client_uuid);
    counters$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
          this.counters = values;
          this.nuevoNotaDebito.controls['clientName'].setValue(
            this.clients.find(element => element.uuid === client_uuid).name
          );
        },
        error => {
          log.debug(`Get Clients error: ${error}`);
        }
      );
  }

  setProviderName(provider_uuid: string) {
    this.nuevoNotaDebito.controls['providerName'].setValue(
      this.providers.find(element => element.uuid === provider_uuid).name
    );
  }

  setCounteName(counter_uuid: string) {
    this.nuevoNotaDebito.controls['counterName'].setValue(
      this.counters.find(element => element.uuid === counter_uuid).name
    );
  }

  ngOnDestroy() {}

  add_debitnote() {
    const signup$ = this.debitnotesService.addDebitNote(this.nuevoNotaDebito.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoNotaDebito.markAsPristine({ onlySelf: false });
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          if (value.status > 201) {
            this.error = value.message;
          } else {
            this._bottomSheetRef.dismiss();
          }
          this.ngOnInit();
        },
        error => {
          this.error = error;
        }
      );
  }

  update_debitnote() {
    const signup$ = this.debitnotesService.updateDebitNote(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoNotaDebito.markAsPristine({ onlySelf: false });
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          if (value.status > 201) {
            this.error = value.message;
          } else {
            this._bottomSheetRef.dismiss();
          }
          this.ngOnInit();
        },
        error => {
          this.error = error;
        }
      );
  }

  saveDebitNote() {
    this.isLoading = true;
    if (this.data) {
      this.data.code = (<IDebitNoteModel>this.nuevoNotaDebito.value).code;
      this.data.clientName = (<IDebitNoteModel>this.nuevoNotaDebito.value).clientName;
      this.data.client_uuid = (<IDebitNoteModel>this.nuevoNotaDebito.value).client_uuid;
      this.data.providerName = (<IDebitNoteModel>this.nuevoNotaDebito.value).providerName;
      this.data.provider_uuid = (<IDebitNoteModel>this.nuevoNotaDebito.value).provider_uuid;
      this.data.counterName = (<IDebitNoteModel>this.nuevoNotaDebito.value).counterName;
      this.data.counter_uuid = (<IDebitNoteModel>this.nuevoNotaDebito.value).counter_uuid;
      this.data.passenger = (<IDebitNoteModel>this.nuevoNotaDebito.value).passenger;
      this.data.service = (<IDebitNoteModel>this.nuevoNotaDebito.value).service;
      this.data.voucher = (<IDebitNoteModel>this.nuevoNotaDebito.value).voucher;
      this.data.concept = (<IDebitNoteModel>this.nuevoNotaDebito.value).concept;
      this.data.current_date = (<IDebitNoteModel>this.nuevoNotaDebito.value).current_date;
      this.data.expiration_date = (<IDebitNoteModel>this.nuevoNotaDebito.value).expiration_date;
      this.data.change = (<IDebitNoteModel>this.nuevoNotaDebito.value).change;
      this.data.amount_dollar = (<IDebitNoteModel>this.nuevoNotaDebito.value).amount_dollar;
      this.data.amount_currency = (<IDebitNoteModel>this.nuevoNotaDebito.value).amount_currency;
      this.data.settlement = (<IDebitNoteModel>this.nuevoNotaDebito.value).settlement;
      this.data.state = (<IDebitNoteModel>this.nuevoNotaDebito.value).state;
      this.update_debitnote();
    } else {
      this.add_debitnote();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm(data: IDebitNoteModel) {
    if (data) {
      this.nuevoNotaDebito = this.fb.group({
        code: [data.code, Validators.required],
        clientName: [data.clientName, Validators.nullValidator],
        client_uuid: [data.client_uuid, Validators.required],
        providerName: [data.providerName, Validators.nullValidator],
        provider_uuid: [data.provider_uuid, Validators.required],
        counterName: [data.counterName, Validators.nullValidator],
        counter_uuid: [data.counter_uuid, Validators.required],
        passenger: [data.passenger, Validators.required],
        service: [data.service, Validators.required],
        voucher: [data.voucher, Validators.required],
        concept: [data.concept, Validators.required],
        current_date: [data.current_date, Validators.required],
        expiration_date: [data.expiration_date, Validators.required],
        change: [data.change, Validators.nullValidator],
        amount_dollar: [data.amount_dollar, Validators.nullValidator],
        amount_currency: [data.amount_currency, Validators.nullValidator],
        settlement: [data.settlement, Validators.nullValidator],
        state: [data.state, Validators.required]
      });
    } else {
      this.nuevoNotaDebito = this.fb.group({
        code: ['210+', Validators.required],
        clientName: ['', Validators.nullValidator],
        client_uuid: ['', Validators.required],
        providerName: ['', Validators.nullValidator],
        provider_uuid: ['', Validators.required],
        counterName: ['', Validators.nullValidator],
        counter_uuid: ['', Validators.required],
        passenger: ['', Validators.required],
        service: ['', Validators.required],
        voucher: ['', Validators.required],
        concept: ['', Validators.required],
        current_date: [formatDate(new Date(), 'MM/dd/yyyy', 'en'), Validators.required],
        expiration_date: ['', Validators.required],
        change: ['', Validators.nullValidator],
        amount_dollar: ['', Validators.nullValidator],
        amount_currency: ['', Validators.nullValidator],
        settlement: ['', Validators.nullValidator],
        state: [1, Validators.required]
      });
    }
  }
}
