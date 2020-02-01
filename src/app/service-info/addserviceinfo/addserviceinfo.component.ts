import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { IService_info, ServiceInfoService } from '@app/service-info/service-info-service';
import { IProviderModel, ProvidersService } from '@app/providers/providers-service';

const log = new Logger('AddServiceInfo');
@Component({
  selector: 'Addserviceinfo',
  templateUrl: 'addserviceinfo.component.html',
  styleUrls: ['addserviceinfo.component.scss']
})
export class AddserviceinfoComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoService!: FormGroup;
  isLoading = false;
  data!: IService_info;
  providers!: IProviderModel[];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddserviceinfoComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: IService_info,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private serviceInfoService: ServiceInfoService,
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
    const providers$ = this.providersService.findAll();
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
          log.debug(`Get Clients error: ${error}`);
        }
      );
  }

  ngOnDestroy() {}

  add_service_info() {
    const signup$ = this.serviceInfoService.addService(this.nuevoService.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoService.markAsPristine({ onlySelf: false });
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
            log.info(`after verification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Add user eror: ${error}`);
          this.error = error;
        }
      );
  }

  update_service_info() {
    const signup$ = this.serviceInfoService.updateService(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoService.markAsPristine({ onlySelf: false });
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
            log.info(`after verification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Add user eror: ${error}`);
          this.error = error;
        }
      );
  }

  saveServiceInfo() {
    this.isLoading = true;
    if (this.data) {
      this.data.provider_uuid = (<IService_info>this.nuevoService.value).provider_uuid;
      this.data.description = (<IService_info>this.nuevoService.value).description;
      this.data.base_price = (<IService_info>this.nuevoService.value).base_price;
      this.update_service_info();
    } else {
      this.add_service_info();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm(data: IService_info) {
    if (data) {
      this.nuevoService = this.fb.group({
        description: [data.description, Validators.required],
        base_price: [data.base_price, Validators.required],
        provider_uuid: [data.provider_uuid, Validators.required]
      });
    } else {
      this.nuevoService = this.fb.group({
        description: ['', Validators.required],
        base_price: ['', Validators.required],
        provider_uuid: ['', Validators.required]
      });
    }
  }
}
