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
  nuevoCliente!: FormGroup;
  isLoading = false;
  data!: IClientModel;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddclientComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: IClientModel,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private clientsService: ClientsService
  ) {
    this.data = data;
    if (this.data) {
      this.createForm(this.data);
    } else {
      this.createForm(null);
    }
  }

  ngOnInit() {}

  ngOnDestroy() {}

  add_client() {
    const signup$ = this.clientsService.addClient(this.nuevoCliente.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoCliente.markAsPristine({ onlySelf: false });
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          // log.info(`after request ${this.isLoading}`);
          // log.info(value);
          if (value.status > 201) {
            this.error = value.message;
            // log.info(`after error ${this.isLoading}`);
          } else {
            this._bottomSheetRef.dismiss();
            // log.info(`after vernification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Add client error: ${error}`);
          this.error = error;
        }
      );
  }

  update_client() {
    const signup$ = this.clientsService.updateClient(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoCliente.markAsPristine({ onlySelf: false });
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          if (value.status > 201) {
            this.error = value.message;
            // log.info(`after error ${this.isLoading}`);
          } else {
            this._bottomSheetRef.dismiss();
            // log.info(`after vernification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Update client error: ${error}`);
          this.error = error;
        }
      );
  }

  saveClient() {
    this.isLoading = true;
    if (this.data) {
      this.data.name = (<IClientModel>this.nuevoCliente.value).name;
      this.data.address = (<IClientModel>this.nuevoCliente.value).address;
      this.data.phone = (<IClientModel>this.nuevoCliente.value).phone;
      this.data.email = (<IClientModel>this.nuevoCliente.value).email;
      this.update_client();
    } else {
      this.add_client();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm(data: IClientModel) {
    if (data == null) {
      this.nuevoCliente = this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['', Validators.required]
      });
    } else {
      this.nuevoCliente = this.fb.group({
        name: [data.name, Validators.required],
        address: [data.address, Validators.required],
        email: [data.email, Validators.required],
        phone: [data.phone, Validators.required]
      });
    }
  }
}
