import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import {combineLatest, map, Subject, take} from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { MathJaxConnector } from '@/features/akn-document/services/math-jax-connector';
import { RefToLinkConnector } from '@/features/akn-document/services/ref-to-link-connector';
import { SoftActionsConnector } from '@/features/akn-document/services/soft-actions-connector';
import { Require } from '@/features/leos-legacy/models/requirejs';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { LeosAppConfig } from '@/shared/models/leos.model';

@Injectable({
  providedIn: 'root',
})
export class MilestoneViewConnectorsService {
  private refToLinkConnector?: RefToLinkConnector;
  private softActionsConnector?: SoftActionsConnector;
  private mathJaxConnector?: MathJaxConnector;

  constructor(
    private leosLegacyService: LeosLegacyService,
    private appConfig: AppConfigService,
  ) {}

  destroyExtensions() {
    this.softActionsConnector?.destroy();
    this.refToLinkConnector?.destroy();
    this.mathJaxConnector?.destroy();
  }

  init(rootElement: HTMLElement) {
    combineLatest([this.leosLegacyService.require$, this.getLeosState()])
      .pipe(take(1))
      .subscribe(([require, leosState]) => {
        require(['js/leosModulesBootstrap']);
        this.initSoftActions(require, leosState, rootElement);
        this.initMathJax(require, leosState, rootElement);
        this.initRefToLink(require, leosState, rootElement);
      });
  }

  refreshStateAllAvailableConnectors() {
    this.softActionsConnector?.$triggerStateChange();
    this.refToLinkConnector?.$triggerStateChange();
  }

  private initRefToLink(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.refToLinkConnector = new RefToLinkConnector(
      //TODO pass only required state
      leosState,
      {
        rootElement,
      },
    );
    require(['extension/refToLinkExtension'], (refToLink) => {
      refToLink.init(this.refToLinkConnector);
      this.refToLinkConnector.jsDepsInited();
    });
  }

  private initSoftActions(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    const otherTargets = null;
    this.softActionsConnector = new SoftActionsConnector(
      //TODO pass only required state
      leosState,
      otherTargets,
      {
        rootElement,
      },
    );
    this.softActionsConnector.getState().isTrackChangesShowed = true;
    require(['extension/softActionsExtension'], (softActions) => {
      softActions.init(this.softActionsConnector);
      this.softActionsConnector.jsDepsInited();
    });
  }

  private initMathJax(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.mathJaxConnector = new MathJaxConnector(leosState, {
      rootElement,
    });

    require(['extension/mathJaxExtension'], (mathJax) => {
      mathJax.init(this.mathJaxConnector);
      this.mathJaxConnector.jsDepsInited();
    });
  }

  private getLeosState() {
    return combineLatest([
      this.appConfig.config,
    ]).pipe(
      map(([config]) =>
        this.renameConfigKeysForEditor({ ...config}),
      ),
    );
  }

  // called from constructor
  private renameConfigKeysForEditor(config: any) {
    const oldConfig: LeosAppConfig = cloneDeep(config);

    config['permissions'] = oldConfig.userAppPermissions;

    return config;
  }
}
