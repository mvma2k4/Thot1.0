import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { IDebitNoteModel, DebitNotesService } from '@app/debitnotes/debitnotes-service';

const log = new Logger('AddDebitNote');
@Component({
  selector: 'Addprovider',
  templateUrl: 'addprovider.component.html',
  styleUrls: ['addprovider.component.scss']
})
export class AddproviderComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoNotaDebito!: FormGroup;
  isLoading = false;
  data!: IDebitNoteModel;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AddproviderComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: IDebitNoteModel,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private debitnotesService: DebitNotesService
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
    const signup$ = this.debitnotesService.addDebitNote(this.nuevoNotaDebito.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoNotaDebito.markAsPristine({ onlySelf: false });
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
    const signup$ = this.debitnotesService.updateDebitNote(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoNotaDebito.markAsPristine({ onlySelf: false });
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

  saveDebitNote() {
    this.isLoading = true;
    if (this.data) {
      this.data.name = (<IDebitNoteModel>this.nuevoNotaDebito.value).name;
      this.data.address = (<IDebitNoteModel>this.nuevoNotaDebito.value).address;
      this.data.phone = (<IDebitNoteModel>this.nuevoNotaDebito.value).phone;
      this.update_provider();
    } else {
      this.add_provider();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm(data: IDebitNoteModel) {
    if (data) {
      this.nuevoNotaDebito = this.fb.group({
        name: [data.name, Validators.required],
        address: [data.address, Validators.required],
        phone: [data.phone, Validators.required]
      });
    } else {
      this.nuevoNotaDebito = this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        phone: ['', Validators.required]
      });
    }
  }
}
