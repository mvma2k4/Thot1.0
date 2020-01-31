import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { environment } from '@env/environment';
import { IService_info, ServiceInfoService } from '@app/service-info/service-info-service';
import { IProviderModel, ProvidersService} from '@app/providers/providers-service';

import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';

const log = new Logger('service-infoComponent');

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.component.html',
  styleUrls: ['./service-info.component.scss']
})
export class ServiceInfoComponent implements OnInit {
  version: string = environment.version;
  isLoading = false;

  service_infosColumns: string[] = ['providerName','description','base_price','actions'];
  dataSource: IService_info[] = new Array();

  _matbottomSheetRef: MatBottomSheetRef = null;

  constructor(
    private serviceInfoService: ServiceInfoService,
    private providersService: ProvidersService,
    private _addserviceSheet: MatBottomSheet
  ) { }

  ngOnInit() {
    this.isLoading = true;
    const serviceInfos$ = this.serviceInfoService.findAll();
    serviceInfos$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }
        ),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
          this.dataSource = values;
          this.dataSource.forEach(service => {
            const provider$ = this.providersService.findOne(service.provider_uuid);
            provider$
              .pipe(
                finalize(() => {
                  log.debug('provider found');
                }),
                untilDestroyed(this)
              )
              .subscribe(values => {
                service.providerName = values.name;
              });
          });
        },
        error => {
          log.debug(`Get Provider error: ${error}`);
        }
      );
  }

  add_service_info():void {
    this._matbottomSheetRef = this._addserviceSheet.open(AddServiceInfoComponent);
    this._matbottomSheetRef
      .afterDismissed()
      .pipe(
        finalize(()=> {
          this.ngOnInit();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
        },
        error => {
          log.error(`Get error after return add serviceinfo component: ${error}`);
        }
      );
  }

  edit_service_info(service: IService_info): void {
    log.debug(`edit service ${service}`);
    this._matbottomSheetRef = this._addserviceSheet.open(AddServiceInfoComponent,{
      data: service
    });
    this._matbottomSheetRef
      .afterDismissed()
      .pipe(
        finalize(()=> {
          this.ngOnInit();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
        },
        error => {
          log.error(`Get error after retrun add service component: ${error}`);
        }
      );
  }

  delete_service_info(service: IService_info): void {
    log.debug(service);
    const services$ = this.serviceInfoService.removeService(service);
    services$
      .pipe(
        finalize(()=> {
          this.isLoading = false;
          this.ngOnInit();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
          this.dataSource = values;
        },
        error => {
          log.debug(`Get services error: ${error}`);
        }
      );
  }

}
