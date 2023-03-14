import { Injectable } from '@angular/core';

import { ENV_TYPE } from '../models/environment.model';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private instanceName: string;

  constructor() {
    // Get the instance name from the environment variables
    console.log(process.env);
    this.instanceName = process.env.NG_APP_LEOS_INSTANCE;
  }

  public getInstanceName(): ENV_TYPE {
    return this.instanceName.toLowerCase() as ENV_TYPE;
  }

  public isCouncil(): boolean {
    return this.instanceName === 'cn';
  }
}
