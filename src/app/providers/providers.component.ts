import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { environment } from '@env/environment';
import { IProviderModel, ProvidersService } from '@app/providers/providers-service';
import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';
import { AddproviderComponent } from './addproviders/addprovider.component';

const log = new Logger('providersComponent');

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {
  version: string = environment.version;
  isLoading = false;

  providersColumns: string[] = ['name', 'address', 'phone', 'actions'];
  dataSource: IProviderModel[] = new Array();

  _matbottonSheetRef: MatBottomSheetRef = null;

  constructor(private providersService: ProvidersService, private _addproviderSheet: MatBottomSheet) {}

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
          this.dataSource = values;
        },
        error => {
          log.debug(`Get Providers error: ${error}`);
        }
      );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  add_provider(): void {
    this.isLoading = true;
    this._matbottonSheetRef = this._addproviderSheet.open(AddproviderComponent);
    this._matbottonSheetRef
      .afterDismissed()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.ngOnInit();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
        },
        error => {
          log.error(`Get error after return add provider component: ${error}`);
        }
      );
  }

  edit_provider(provider: IProviderModel): void {
    log.debug(`edit provider ${provider}`);
    this._matbottonSheetRef = this._addproviderSheet.open(AddproviderComponent, {
      data: provider
    });
    this._matbottonSheetRef
      .afterDismissed()
      .pipe(
        finalize(() => {
          this.ngOnInit();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        values => {
          log.debug(values);
        },
        error => {
          log.error(`Get error after return add provider component: ${error}`);
        }
      );
  }

  delete_provider(provider: IProviderModel): void {
    log.debug(provider);
    const providers$ = this.providersService.removeProvider(provider);
    providers$
      .pipe(
        finalize(() => {
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
          log.debug(`Get Providers error: ${error}`);
        }
      );
  }
}
