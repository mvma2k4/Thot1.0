import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersService } from './users-service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AdduserComponent } from './adduser/adduser.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    UsersRoutingModule
  ],
  providers: [UsersService],
  declarations: [UsersComponent, AdduserComponent]
})
export class UsersModule {}
