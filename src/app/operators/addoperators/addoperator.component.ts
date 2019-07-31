import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { IOperatorModel, OperatorsService } from '@app/operators/operators-service';

const log = new Logger('AddOperator');
@Component({
  selector: 'Addoperator',
  templateUrl: 'addoperator.component.html',
  styleUrls: ['addoperator.component.scss']
})
export class AddoperatorComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoOperador!: FormGroup;
  isLoading = false;
  data!: IOperatorModel;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddoperatorComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: IOperatorModel,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private operatorsService: OperatorsService
  ) {
    this.createForm();
    this.data = data;
  }

  ngOnInit() {
    if (this.data) {
    }
  }

  ngOnDestroy() {}

  add_operator() {
    const signup$ = this.operatorsService.addOperator(this.nuevoOperador.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoOperador.markAsPristine({ onlySelf: false });
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
          log.debug(`Add operator eror: ${error}`);
          this.error = error;
        }
      );
  }

  update_operator() {
    const signup$ = this.operatorsService.updateOperator(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoOperador.markAsPristine({ onlySelf: false });
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
          log.debug(`Add operator eror: ${error}`);
          this.error = error;
        }
      );
  }

  saveOperator() {
    this.isLoading = true;
    if (this.data) {
      log.debug(this.data);
      this.update_operator();
    } else {
      this.add_operator();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm() {
    this.nuevoOperador = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }
}
