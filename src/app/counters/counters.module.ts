import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { CounterRoutingModule } from './counters-routing.module';
import { CountersComponent } from './counters.component';
import { CountersService } from './counters-service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AddcounterComponent } from './addcounter/addcounter.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    CounterRoutingModule
  ],
  providers: [CountersService],
  declarations: [CountersComponent, AddcounterComponent]
})
export class CountersModule {}
