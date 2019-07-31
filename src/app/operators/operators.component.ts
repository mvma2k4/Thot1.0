import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { environment } from '@env/environment';
import { IOperatorModel, OperatorsService } from '@app/operators/operators-service';
import { finalize } from 'rxjs/operators';

import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core';
import { AddoperatorComponent } from './addoperators/addoperator.component';

const log = new Logger('operatorsComponent');

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit {
  version: string = environment.version;
  isLoading = false;

  operatorsColumns: string[] = ['name', 'address', 'phone', 'actions'];
  dataSource: IOperatorModel[] = new Array();

  _matbottonSheetRef: MatBottomSheetRef = null;

  constructor(private operatorsService: OperatorsService, private _addoperatorSheet: MatBottomSheet) {}

  ngOnInit() {
    this.isLoading = true;
    const operators$ = this.operatorsService.findAll();
    operators$
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
          log.debug(`Get Operators error: ${error}`);
        }
      );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  add_operator(): void {
    this.isLoading = true;
    this._matbottonSheetRef = this._addoperatorSheet.open(AddoperatorComponent);
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
          log.error(`Get error after return add operator component: ${error}`);
        }
      );
  }

  edit_operator(operator: IOperatorModel): void {
    log.debug(`edit operator ${operator}`);
    this._matbottonSheetRef = this._addoperatorSheet.open(AddoperatorComponent, {
      data: operator
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
          log.error(`Get error after return add operator component: ${error}`);
        }
      );
  }

  delete_operator(operator: IOperatorModel): void {
    log.debug(operator);
    const operators$ = this.operatorsService.removeOperator(operator);
    operators$
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
          log.debug(`Get Operators error: ${error}`);
        }
      );
  }
}
