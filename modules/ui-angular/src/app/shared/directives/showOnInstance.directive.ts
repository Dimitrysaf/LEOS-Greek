import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { ENV_TYPE } from '../models/environment.model';
import { EnvironmentService } from '../services/enviroment.service';

@Directive({
  selector: '[appShowOnInstance]',
})
export class ShowOnInstanceDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private environmentService: EnvironmentService,
  ) {}

  @Input() set appShowOnInstance(instances: ENV_TYPE[]) {
    if (instances.includes(this.environmentService.getInstanceName())) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
