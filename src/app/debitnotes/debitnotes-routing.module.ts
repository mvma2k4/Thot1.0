import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { DebitNotesComponent } from './debitnotes.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'providers', component: DebitNotesComponent, data: { title: extract('DebitNotes') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DebitNotesRoutingModule {}
