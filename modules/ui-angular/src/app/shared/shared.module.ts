import { NgModule } from '@angular/core';
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
  ],
  declarations: [],
  exports: [
    UxAllModule,
    EuiAllModule,
    NgForTrackByPropertyModule,
    TranslateModule,
  ],
})
export class SharedModule {}
