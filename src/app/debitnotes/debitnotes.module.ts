import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { DebitNotesRoutingModule } from './debitnotes-routing.module';
import { DebitNotesComponent } from './debitnotes.component';
import { DebitNotesService } from './debitnotes-service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AddproviderComponent } from './adddebitnote/adddebitnote.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    DebitNotesRoutingModule
  ],
  providers: [DebitNotesService],
  declarations: [DebitNotesComponent, AddproviderComponent]
})
export class DebitNotesModule {}
