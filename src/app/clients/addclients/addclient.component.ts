import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { IClientModel, ClientsService } from '@app/clients/clients-service';

const log = new Logger('AddClient');
@Component({
  selector: 'Addclient',
  templateUrl: 'addclient.component.html',
  styleUrls: ['addclient.component.scss']
})
export class AddclientComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoProveedor!: FormGroup;
  isLoading = false;
  data!: IClientModel;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddclientComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: IClientModel,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private clientsService: ClientsService
  ) {
    this.createForm();
    this.data = data;
  }

  ngOnInit() {
    if (this.data) {
    }
  }

  ngOnDestroy() {}

  add_client() {
    const signup$ = this.clientsService.addClient(this.nuevoProveedor.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoProveedor.markAsPristine({ onlySelf: false });
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          log.info(`after request ${this.isLoading}`);
          log.info(value);
          if (value.status != 200) {
            this.error = value.message;
            log.info(`after error ${this.isLoading}`);
          } else {
            this._bottomSheetRef.dismiss();
            log.info(`after vernification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Add client eror: ${error}`);
          this.error = error;
        }
      );
  }

  update_client() {
    const signup$ = this.clientsService.updateClient(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoProveedor.markAsPristine({ onlySelf: false });
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          log.info(`after request ${this.isLoading}`);
          log.info(value);
          if (value.status != 200) {
            this.error = value.message;
            log.info(`after error ${this.isLoading}`);
          } else {
            this._bottomSheetRef.dismiss();
            log.info(`after vernification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Add client eror: ${error}`);
          this.error = error;
        }
      );
  }

  saveClient() {
    this.isLoading = true;
    if (this.data) {
      log.debug(this.data);
      this.update_client();
    } else {
      this.add_client();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm() {
    this.nuevoProveedor = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }
}
