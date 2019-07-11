import { Component } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'Adduser',
  templateUrl: 'adduser.component.html'
})
export class AdduserComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<AdduserComponent>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
