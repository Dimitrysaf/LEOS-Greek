import { Injectable } from '@angular/core';

import { ENV_TYPE } from '../models/environment.model';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private instanceName: string;

  constructor() {
    // Get the instance name from the environment variables
    this.instanceName = 'CN';
  }

  public getInstanceName(): ENV_TYPE {
    return 'CN' as ENV_TYPE;
  }

  public isCouncil(): boolean {
    return this.instanceName === 'CN';
  }
}
