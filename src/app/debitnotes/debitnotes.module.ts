import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { DebitnoteRoutingModule } from './debitnotes-routing.module';
import { DebitnoteComponent } from './debitnotes.component';
import { DebitnoteService } from './debitnotes-service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AdddebitnoteComponent } from './adddebitnote/adddebitnote.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    DebitnoteRoutingModule
  ],
  providers: [DebitnoteService],
  declarations: [DebitnoteComponent, AdddebitnoteComponent]
})
export class DebitnoteModule {}
