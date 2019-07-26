import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { CountersComponent } from './counters.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'counters', component: CountersComponent, data: { title: extract('Counters') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CounterRoutingModule {}
