import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { ClientsService } from './clients-service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AddclientComponent } from './addclients/addclient.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    ClientsRoutingModule
  ],
  providers: [ClientsService],
  declarations: [ClientsComponent, AddclientComponent]
})
export class ClientsModule {}
