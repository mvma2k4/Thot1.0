import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { IProviderModel, ProvidersService } from '@app/providers/providers-service';

const log = new Logger('AddProvider');
@Component({
  selector: 'Addprovider',
  templateUrl: 'addprovider.component.html',
  styleUrls: ['addprovider.component.scss']
})
export class AddproviderComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoProveedor!: FormGroup;
  isLoading = false;
  data!: IProviderModel;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddproviderComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: IProviderModel,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
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
    if (this.data) {
    }
  }

  ngOnDestroy() {}

  add_provider() {
    const signup$ = this.providersService.addProvider(this.nuevoProveedor.value);
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

  update_provider() {
    const signup$ = this.providersService.updateProvider(this.data);
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

  saveProvider() {
    this.isLoading = true;
    if (this.data) {
      this.data.name = (<IProviderModel>this.nuevoProveedor.value).name;
      this.data.address = (<IProviderModel>this.nuevoProveedor.value).address;
      this.data.phone = (<IProviderModel>this.nuevoProveedor.value).phone;
      this.update_provider();
    } else {
      this.add_provider();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm(data: IProviderModel) {
    if (data) {
      this.nuevoProveedor = this.fb.group({
        name: [data.name, Validators.required],
        address: [data.address, Validators.required],
        phone: [data.phone, Validators.required]
      });
    } else {
      this.nuevoProveedor = this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        phone: ['', Validators.required]
      });
    }
  }
}
