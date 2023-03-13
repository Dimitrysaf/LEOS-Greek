import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, lastValueFrom, Observable, take } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { Require } from '@/features/leos-legacy/models/requirejs';
import { DomService } from '@/shared/services/dom.service';

@Injectable({
  providedIn: 'root',
})
export class LeosLegacyService {
  require$: Observable<Require>;

  private requireSubj = new BehaviorSubject<Require>(null);

  constructor(private dom: DomService, private config: AppConfigService) {
    this.require$ = this.requireSubj.pipe(filter(Boolean), take(1));
    void this.init();
  }

  private async init() {
    if (!this.isInitialized()) {
      await this.setupRequireJsConfig();
      await this.loadRequireJsScript();
      await this.loadLeosModulesBootstrap();
    }
    this.requireSubj.next((window as any).require);
  }

  private isInitialized() {
    return typeof (window as any).require === 'function';
  }

  /** @see `modules/js/src/main/js/leosBootstrap.js` */
  private async setupRequireJsConfig() {
    const baseUrl = await this.getBaseUrl();

    // ensure LEOS global namespace to export application functions and data
    window.LEOS = window.LEOS || ({} as unknown as typeof window.LEOS);

    // default settings
    const defaults = {
      // standard MIME type for JavaScript
      scriptType: 'application/javascript',
      // base URL to use for all modules/resources lookup
      baseUrl,
      // loading modules/resources timeout in seconds (0 = no timeout)
      waitSeconds: 60,
      // enforce define to improve catching load failures in IE
      enforceDefine: true,
      // set additional configuration to be passed to specified modules
      config: {
        'js/leosModulesBootstrap': {
          logLevel:
            process.env.NG_APP_ENV === 'production' ? undefined : 'debug',
        },
      },
    };

    // expose settings through LEOS configuration
    // this might be useful later on (e.g. debug)
    window.LEOS.config = { ...defaults, ...window.LEOS_BOOTSTRAP_CONFIG };

    // set RequireJS window configuration variable, that
    // will be applied automatically when RequireJS loads
    // @ts-ignore - RequireJS will look for a config object and then replace it with
    // the actual `require` function
    window.require = window.LEOS.config;
  }

  private async getBaseUrl() {
    /* require('js/xyz') -> `${basrUrl}/js/xys` */
    const { mappingUrl } = await lastValueFrom(this.config.config);
    return mappingUrl;
  }

  private async loadRequireJsScript() {
    const baseUrl = await this.getBaseUrl();
    await this.dom.loadScript(`${baseUrl}/lib/requirejs_2.3.3/require.js`);
  }

  private async loadLeosModulesBootstrap() {
    const baseUrl = await this.getBaseUrl();
    await this.dom.loadScript(`${baseUrl}/js/leosModulesBootstrap.js`);
  }
}
