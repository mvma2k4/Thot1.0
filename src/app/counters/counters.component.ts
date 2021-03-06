import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { environment } from '@env/environment';
import { ICounter, CountersService } from '@app/counters/counters-service';
import { IClientModel, ClientsService } from '@app/clients/clients-service';
import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';
import { AddcounterComponent } from './addcounter/addcounter.component';

const log = new Logger('countersComponent');

@Component({
  selector: 'app-counters',
  templateUrl: './counters.component.html',
  styleUrls: ['./counters.component.scss']
})
export class CountersComponent implements OnInit {
  version: string = environment.version;
  isLoading = false;

  countersColumns: string[] = ['clientName', 'name', 'email', 'actions'];
  dataSource: ICounter[] = new Array();

  _matbottonSheetRef: MatBottomSheetRef = null;

  constructor(
    private countersService: CountersService,
    private clientesService: ClientsService,
    private _addcounterSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.isLoading = true;
    const counter$ = this.countersService.findAll();
    counter$
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
          this.dataSource.forEach(counter => {
            const client$ = this.clientesService.findOne(counter.client_uuid);
            client$
              .pipe(
                finalize(() => {
                  log.debug('client found');
                }),
                untilDestroyed(this)
              )
              .subscribe(values => {
                counter.clientName = values.name;
              });
          });
        },
        error => {
          log.debug(`Get Counters error: ${error}`);
        }
      );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  add_counter(): void {
    this._matbottonSheetRef = this._addcounterSheet.open(AddcounterComponent);
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
          log.error(`Get error after return add counter component: ${error}`);
        }
      );
  }

  edit_counter(counter: ICounter): void {
    log.debug(`edit counter ${counter}`);
    this._matbottonSheetRef = this._addcounterSheet.open(AddcounterComponent, {
      data: counter
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
          log.error(`Get error after return add counter component: ${error}`);
        }
      );
  }

  delete_counter(counter: ICounter): void {
    log.debug(counter);
    const counters$ = this.countersService.removeCounter(counter);
    counters$
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
          log.debug(`Get Counters error: ${error}`);
        }
      );
  }
}
