import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { ICounter, CountersService } from '@app/counters/counters-service';
import { IClientModel, ClientsService } from '@app/clients/clients-service';

const log = new Logger('AddCounter');
@Component({
  selector: 'Addcounter',
  templateUrl: 'addcounter.component.html',
  styleUrls: ['addcounter.component.scss']
})
export class AddcounterComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoCounter!: FormGroup;
  isLoading = false;
  data!: ICounter;
  clients!: IClientModel[];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddcounterComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: ICounter,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private countersService: CountersService,
    private clientsService: ClientsService
  ) {
    this.createForm();
    this.data = data;
  }

  ngOnInit() {
    this.isLoading = true;
    const clients$ = this.clientsService.findAll();
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
  }

  ngOnDestroy() {}

  add_counter() {
    const signup$ = this.countersService.addCounter(this.nuevoCounter.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoCounter.markAsPristine({ onlySelf: false });
          this._changeDetectorRef.markForCheck();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          log.info(`after request ${this.isLoading}`);
          log.info(value);
          if (value.status > 201) {
            this.error = value.message;
            log.info(`after error ${this.isLoading}`);
          } else {
            this._bottomSheetRef.dismiss();
            log.info(`after vernification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Add user eror: ${error}`);
          this.error = error;
        }
      );
  }

  update_counter() {
    const signup$ = this.countersService.updateCounter(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoCounter.markAsPristine({ onlySelf: false });
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          log.info(`after request ${this.isLoading}`);
          log.info(value);
          if (value.status > 201) {
            this.error = value.message;
            log.info(`after error ${value}`);
          } else {
            this._bottomSheetRef.dismiss();
            log.info(`after vernification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Add user eror: ${error}`);
          this.error = error;
        }
      );
  }

  saveCounter() {
    this.isLoading = true;
    if (this.data) {
      log.debug(this.data);
      this.update_counter();
    } else {
      this.add_counter();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm() {
    this.nuevoCounter = this.fb.group({
      address: ['', Validators.required],
      phone: ['', Validators.required],
      name: ['', Validators.required],
      client_uuid: ['', Validators.required]
    });
  }
}
