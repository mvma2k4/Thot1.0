import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { ProvidersRoutingModule } from './providers-routing.module';
import { ProvidersComponent } from './providers.component';
import { ProvidersService } from './providers-service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AddproviderComponent } from './addproviders/addprovider.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    ProvidersRoutingModule
  ],
  providers: [ProvidersService],
  declarations: [ProvidersComponent, AddproviderComponent]
})
export class ProvidersModule {}
