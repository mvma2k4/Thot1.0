import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { environment } from '@env/environment';
import { IDebitNoteModel, DebitNotesService } from '@app/debitnotes/debitnotes-service';
import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';
import { AddproviderComponent } from './adddebitnote/adddebitnote.component';

const log = new Logger('debitnotesComponent');

@Component({
  selector: 'app-debitnotes',
  templateUrl: './debitnotes.component.html',
  styleUrls: ['./debitnotes.component.scss']
})
export class DebitNotesComponent implements OnInit {
  version: string = environment.version;
  isLoading = false;

  debitnotesColumns: string[] = ['name', 'address', 'phone', 'actions'];
  dataSource: IDebitNoteModel[] = new Array();

  _matbottonSheetRef: MatBottomSheetRef = null;

  constructor(private debitnotesService: DebitNotesService, private _addproviderSheet: MatBottomSheet) {}

  ngOnInit() {
    this.isLoading = true;
    const debitnotes$ = this.debitnotesService.findAll();
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
          log.debug(`Get DebitNotes error: ${error}`);
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

  edit_provider(provider: IDebitNoteModel): void {
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

  delete_provider(provider: IDebitNoteModel): void {
    log.debug(provider);
    const debitnotes$ = this.debitnotesService.removeDebitNote(provider);
    debitnotes$
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
          log.debug(`Get DebitNotes error: ${error}`);
        }
      );
  }
}
