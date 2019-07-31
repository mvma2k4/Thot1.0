import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersModule } from './users/users.module';
import { AdduserComponent } from './users/adduser/adduser.component';
import { CountersModule } from './counters/counters.module';
import { OperatorsModule } from './operators/operators.module';
import { AddcounterComponent } from './counters/addcounter/addcounter.component';
import { AddoperatorComponent } from './operators/addoperators/addoperator.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AboutModule,
    UsersModule,
    CountersModule,
    OperatorsModule,
    LoginModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route
  ],
  entryComponents: [AdduserComponent, AddcounterComponent, AddoperatorComponent],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
