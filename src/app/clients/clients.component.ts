import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { environment } from '@env/environment';
import { IClientModel, ClientsService } from '@app/clients/clients-service';
import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';
import { AddclientComponent } from './addclients/addclient.component';

const log = new Logger('clientsComponent');

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  version: string = environment.version;
  isLoading = false;

  clientsColumns: string[] = ['name', 'address', 'phone', 'actions'];
  dataSource: IClientModel[] = new Array();

  _matbottonSheetRef: MatBottomSheetRef = null;

  constructor(private clientsService: ClientsService, private _addclientSheet: MatBottomSheet) {}

  ngOnInit() {
    this.isLoading = true;
    const clients$ = this.clientsService.findAll();
    clients$
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
          log.debug(`Get Clients error: ${error}`);
        }
      );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  add_client(): void {
    this.isLoading = true;
    this._matbottonSheetRef = this._addclientSheet.open(AddclientComponent);
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
          log.error(`Get error after return add client component: ${error}`);
        }
      );
  }

  edit_client(client: IClientModel): void {
    log.debug(`edit client ${client}`);
    this._matbottonSheetRef = this._addclientSheet.open(AddclientComponent, {
      data: client
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
          log.error(`Get error after return add client component: ${error}`);
        }
      );
  }

  delete_client(client: IClientModel): void {
    log.debug(client);
    const clients$ = this.clientsService.removeClient(client);
    clients$
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
          log.debug(`Get Clients error: ${error}`);
        }
      );
  }
}
