import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';

import { Permission } from '../models';

@Directive({ selector: '[appUserHasPermission]' })
export class UserHasPermissionDirective implements OnDestroy {
  private permissionsForUser: Permission[];
  private destroy$: Subject<any> = new Subject();
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private appConfig: AppConfigService,
  ) {
    this.appConfig.config.pipe().subscribe((config) => {
      this.permissionsForUser = config.permissions;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  @Input() set appUserHasPermission(permissionsRequired: Permission[]) {
    if (
      permissionsRequired.every((required) =>
        this.permissionsForUser.includes(required),
      )
    ) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
