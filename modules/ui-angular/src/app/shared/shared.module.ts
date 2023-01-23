import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EuiAllModule } from '@eui/components';
import { UxAllModule } from '@eui/components/legacy';
import { TranslateModule } from '@ngx-translate/core';
import { NgForTrackByPropertyModule } from 'ng-for-track-by-property';

@NgModule({
  imports: [
    UxAllModule,
    EuiAllModule,
    NgForTrackByPropertyModule,
    TranslateModule,
    FormsModule,
    DragDropModule,
  ],
  declarations: [],
  exports: [
    UxAllModule,
    EuiAllModule,
    NgForTrackByPropertyModule,
    TranslateModule,
    FormsModule,
    DragDropModule,
  ],
})
export class SharedModule {}
