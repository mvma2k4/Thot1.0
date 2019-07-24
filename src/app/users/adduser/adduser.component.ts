import { Component } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
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
export class AdduserComponent {
  error: string | undefined;
  nuevoUsuario!: FormGroup;
  isLoading = false;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AdduserComponent>,
    fb: FormBuilder,
    private usersService: UsersService
  ) {
    this.nuevoUsuario = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      fullname: ['', Validators.required]
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}

  addUser() {
    this.isLoading = true;
    const signup$ = this.usersService.addUser(this.nuevoUsuario.value);

    signup$
      .pipe(
        finalize(() => {
          this.nuevoUsuario.markAsPristine();
          this.isLoading = false;
          log.info('finalize pipe');
        }),
        untilDestroyed(this)
      )
      .subscribe(
        value => {
          log.info(`after request ${this.isLoading}`);
          if (!value.logged) {
            this.error = value.message;
            this._bottomSheetRef.instance.isLoading = false;
            log.info(`after erroe ${this.isLoading}`);
          } else {
            this.isLoading = false;
            log.info(`after vernificatio ${value.status}`);
          }
        },
        error => {
          log.debug(`Add user Supeerror: ${error}`);
          this.error = error;
        }
      );
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
