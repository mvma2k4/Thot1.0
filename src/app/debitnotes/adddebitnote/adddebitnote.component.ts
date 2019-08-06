import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { ICounter, DebitnoteService } from '@app/debitnotes/debitnotes-service';

const log = new Logger('AddCounter');
@Component({
  selector: 'Adddebitnote',
  templateUrl: 'adddebitnote.component.html',
  styleUrls: ['adddebitnote.component.scss']
})
export class AdddebitnoteComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoDebitnote!: FormGroup;
  isLoading = false;
  data!: ICounter;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AdddebitnoteComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: ICounter,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private debitnotesService: DebitnoteService
  ) {
    this.createForm();
    this.data = data;
  }

  ngOnInit() {}

  ngOnDestroy() {}

  add_debitnote() {
    const signup$ = this.debitnotesService.addCounter(this.nuevoDebitnote.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoDebitnote.markAsPristine({ onlySelf: false });
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
          log.debug(`Add user eror: ${error}`);
          this.error = error;
        }
      );
  }

  update_debitnote() {
    const signup$ = this.debitnotesService.updateCounter(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoDebitnote.markAsPristine({ onlySelf: false });
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          log.info(`after request ${this.isLoading}`);
          log.info(value);
          if (value.status != 200 && value.status != 201) {
            this.error = value.message;
            log.info(`after error ${value}`);
          } else {
            this._bottomSheetRef.dismiss();
            log.info(`after vernification ${value.status}`);
          }
          this.ngOnInit();
        },
        error => {
          log.debug(`Add user eror: ${error}`);
          this.error = error;
        }
      );
  }

  saveCounter() {
    this.isLoading = true;
    if (this.data) {
      log.debug(this.data);
      this.update_debitnote();
    } else {
      this.add_debitnote();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm() {
    this.nuevoDebitnote = this.fb.group({
      address: ['', Validators.required],
      phone: ['', Validators.required],
      name: ['', Validators.required]
    });
  }
}
