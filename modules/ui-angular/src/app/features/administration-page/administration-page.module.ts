import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersManagerComponent} from "@/features/administration-page/components/users-manager/users-manager.component";
import {
  EntitiesManagerComponent
} from "@/features/administration-page/components/entities-manager/entities-manager.component";
import {SharedModule} from "@/shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AdministrationPageRoutingModule} from "@/features/administration-page/administration-page-routing.module";
import {EuiAllModule} from "@eui/components";
import {AdminstrationComponent} from "@/features/administration-page/adminstration.component";
import {TranslateModule} from "@ngx-translate/core";
import {
  EntityInfoComponent
} from "@/features/administration-page/components/entities-manager/entity-info/entity-info.component";
import {UserInfoComponent} from "@/features/administration-page/components/users-manager/user-info/user-info.component";

@NgModule({
  declarations: [
    UsersManagerComponent,
    EntitiesManagerComponent,
    AdminstrationComponent,
  ],
    imports: [
        AdministrationPageRoutingModule,
        CommonModule,
        EuiAllModule,
        SharedModule,
        ReactiveFormsModule,
        TranslateModule,
        EntityInfoComponent,
        UserInfoComponent
    ]
})
export class AdministrationPageModule { }
