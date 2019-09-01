import { Component, OnDestroy, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger, I18nService, untilDestroyed } from '@app/core';

import { IUserModel, UsersService } from '@app/users/users-service';

const log = new Logger('AddUser');
@Component({
  selector: 'Adduser',
  templateUrl: 'adduser.component.html',
  styleUrls: ['adduser.component.scss']
})
export class AdduserComponent implements OnInit, OnDestroy {
  error: string | undefined;
  nuevoUsuario!: FormGroup;
  isLoading = false;
  data!: IUserModel;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AdduserComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) data: IUserModel,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
    this.createForm();
    this.data = data;
  }

  ngOnInit() {
    if (this.data) {
      this.nuevoUsuario.value.fullname = this.data.fullname;
      this.nuevoUsuario.value.email = this.data.email;
      this.nuevoUsuario.value.password = this.data.password;
    }
  }

  ngOnDestroy() {}

  add_user() {
    const signup$ = this.usersService.addUser(this.nuevoUsuario.value);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoUsuario.markAsPristine({ onlySelf: false });
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

  update_user() {
    const signup$ = this.usersService.updateUser(this.data);
    signup$
      .pipe(
        finalize(() => {
          this.nuevoUsuario.markAsPristine({ onlySelf: false });
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
          log.debug(`Add user eror: ${error}`);
          this.error = error;
        }
      );
  }

  saveUser() {
    this.isLoading = true;
    if (this.data) {
      log.debug(this.data);
      this.update_user();
    } else {
      this.add_user();
    }
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  private createForm() {
    this.nuevoUsuario = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      fullname: ['', Validators.required]
    });
  }
}
