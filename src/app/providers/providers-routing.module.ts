import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ProvidersComponent } from './providers.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'providers', component: ProvidersComponent, data: { title: extract('Providers') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProvidersRoutingModule {}
