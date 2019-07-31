import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { OperatorsRoutingModule } from './operators-routing.module';
import { OperatorsComponent } from './operators.component';
import { OperatorsService } from './operators-service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AddoperatorComponent } from './addoperators/addoperator.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    OperatorsRoutingModule
  ],
  providers: [OperatorsService],
  declarations: [OperatorsComponent, AddoperatorComponent]
})
export class OperatorsModule {}
