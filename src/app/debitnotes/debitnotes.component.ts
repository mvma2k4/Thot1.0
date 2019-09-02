import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { environment } from '@env/environment';
import { ICounter, DebitnoteService } from '@app/debitnotes/debitnotes-service';
import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';
import { AdddebitnoteComponent } from './adddebitnote/adddebitnote.component';

const log = new Logger('debitnotesComponent');

@Component({
  selector: 'app-debitnotes',
  templateUrl: './debitnotes.component.html',
  styleUrls: ['./debitnotes.component.scss']
})
export class DebitnoteComponent implements OnInit {
  version: string = environment.version;
  isLoading = false;

  debitnotesColumns: string[] = ['name', 'address', 'phone', 'actions'];
  dataSource: ICounter[] = new Array();

  _matbottonSheetRef: MatBottomSheetRef = null;

  constructor(private debitnotesService: DebitnoteService, private _adddebitnoteSheet: MatBottomSheet) {}

  ngOnInit() {
    this.isLoading = true;
    const debitnote$ = this.debitnotesService.findAll();
    debitnote$
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
          log.debug(`Get Debitnote error: ${error}`);
        }
      );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  add_debitnote(): void {
    this._matbottonSheetRef = this._adddebitnoteSheet.open(AdddebitnoteComponent);
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
          log.error(`Get error after return add debitnote component: ${error}`);
        }
      );
  }

  edit_debitnote(debitnote: ICounter): void {
    log.debug(`edit debitnote ${debitnote}`);
    this._matbottonSheetRef = this._adddebitnoteSheet.open(AdddebitnoteComponent, {
      data: debitnote
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
          log.error(`Get error after return add debitnote component: ${error}`);
        }
      );
  }

  delete_debitnote(debitnote: ICounter): void {
    log.debug(debitnote);
    const debitnotes$ = this.debitnotesService.removeCounter(debitnote);
    debitnotes$
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
          log.debug(`Get Debitnote error: ${error}`);
        }
      );
  }
}