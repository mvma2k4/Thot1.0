import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { IUserModel, UsersService } from '@app/users/users-service';
import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';

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

  constructor(private usersService: UsersService) {}

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
}
