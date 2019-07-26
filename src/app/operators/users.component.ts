import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { environment } from '@env/environment';
import { IUserModel, UsersService } from '@app/users/users-service';
import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';
import { AdduserComponent } from './adduser/adduser.component';

const log = new Logger('usersComponent');

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  version: string = environment.version;
  isLoading = false;

  usersColumns: string[] = ['fullname', 'email', 'actions'];
  dataSource: IUserModel[] = new Array();

  _matbottonSheetRef: MatBottomSheetRef = null;

  constructor(private usersService: UsersService, private _adduserSheet: MatBottomSheet) {}

  ngOnInit() {
    this.isLoading = true;
    const users$ = this.usersService.findAll();
    users$
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
          log.debug(`Get Users error: ${error}`);
        }
      );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  add_user(): void {
    this._matbottonSheetRef = this._adduserSheet.open(AdduserComponent);
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
          log.error(`Get error after return add user component: ${error}`);
        }
      );
  }

  edit_user(user: IUserModel): void {
    log.debug(`edit user ${user}`);
    this._matbottonSheetRef = this._adduserSheet.open(AdduserComponent, {
      data: user
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
          log.error(`Get error after return add user component: ${error}`);
        }
      );
  }

  delete_user(user: IUserModel): void {
    log.debug(user);
    const users$ = this.usersService.removeUser(user);
    users$
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
          log.debug(`Get Users error: ${error}`);
        }
      );
  }
}
