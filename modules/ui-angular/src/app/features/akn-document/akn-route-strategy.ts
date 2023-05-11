import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  DetachedRouteHandle,
} from '@angular/router';

export class AknRouteReUseStrategy extends BaseRouteReuseStrategy {
  public shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    return (
      future.routeConfig === curr.routeConfig || future.data.reuseComponent
    );
  }
}
