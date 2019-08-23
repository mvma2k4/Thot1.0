import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ClientsComponent } from './clients.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'clients', component: ClientsComponent, data: { title: extract('Clients') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ClientsRoutingModule {}
