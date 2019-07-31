import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { OperatorsComponent } from './operators.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'operators', component: OperatorsComponent, data: { title: extract('Operators') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class OperatorsRoutingModule {}
