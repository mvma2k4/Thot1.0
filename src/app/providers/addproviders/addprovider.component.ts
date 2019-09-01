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
    this.createForm();
    this.data = data;
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
          log.debug(`Add provider eror: ${error}`);
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
          log.debug(`Add provider eror: ${error}`);
          this.error = error;
        }
      );
  }

  saveProvider() {
    this.isLoading = true;
    if (this.data) {
      log.debug(this.data);
      this.update_provider();
    } else {
      this.add_provider();
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
