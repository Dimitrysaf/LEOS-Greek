import { debounce } from 'lodash-es';
import { Subject } from 'rxjs';

type RpcObject = Record<string, (...args: any[]) => any>;

type ResizeListener<T extends Element = Element> = (event: {
  element: T;
}) => void;

let parentIdCounter = 0;

/*
 * Provided by Vaadin
 * @see {https://vaadin.com/api/framework/8.14.3/com/vaadin/ui/AbstractJavaScriptComponent.html}
 *
 * TODO: Prefix all non-VAADIN member names with `$` (public) or `_` (private)
 *       to avoid naming collisions
 * TODO: Reconsider need for `dirtyTimestamp`
 */
export abstract class AbstractJavaScriptComponent<
  State extends object,
  El extends Element = Element,
> {
  onStateChange?: (connector: this, event: 'onStateChange') => void;
  onUnregister?: (connector: this, event: 'onUnregister') => void;

  protected destroy$ = new Subject<void>();

  protected _state: State = new Proxy<State>({} as State, {
    set: (target, prop, value, receiver) => {
      if (prop !== 'dirtyTimestamp') {
        target['dirtyTimestamp'] += 1;
      }
      this._stateChanged();
      return Reflect.set(target, prop, value, receiver);
    },
  });

  private static _instances = new Set<AbstractJavaScriptComponent<any>>();

  protected constructor(state?: State, protected _rootElement?: El) {
    Object.assign(this._state, state);
    AbstractJavaScriptComponent._instances.add(this);
  }

  private _parentId = `${++parentIdCounter}`;

  private _stateChanged = debounce(
    () => this.onStateChange?.(this, 'onStateChange'),
    10,
  );

  private resizeObserver?: ResizeObserver;
  private resizeListeners = new Map<Element, Set<ResizeListener>>();

  // getConnectorId(): string; // unused

  getParentId(connectorId?: string) {
    //console.warn('stub:', 'getParentId', connectorId); // FIXME
    return this._parentId;
  }

  getElement(connectorId?: string): Element | null {
    return connectorId === this._parentId ? this._rootElement : null;
  }

  getState() {
    return this._state;
  }

  // registerRpc(rpcObject: RpcObject): void; // unused

  // registerRpc(name: string, rpcObject: RpcObject): void; // unused

  // getRpcProxy(name?: string): RpcObject); // unused

  // translateVaadinUri(uri: string): string; // unused

  addResizeListener<T extends Element>(
    element: T,
    callbackFunction: ResizeListener<T>,
  ) {
    if (!this.resizeListeners.has(element)) {
      this.resizeListeners.set(element, new Set());
      this.getResizeObserver().observe(element);
    }
    this.resizeListeners.get(element).add(callbackFunction);
  }

  removeResizeListener<T extends Element>(
    element: T,
    callbackFunction: ResizeListener<T>,
  ) {
    if (this.resizeListeners.has(element)) {
      this.resizeListeners.get(element).delete(callbackFunction);
      if (this.resizeListeners.get(element).size === 0) {
        this.resizeListeners.delete(element);
        this.resizeObserver?.unobserve(element);
      }
    }
  }

  destroy() {
    this.onUnregister?.(this, 'onUnregister');
    this.resizeListeners.clear();
    this.resizeObserver?.disconnect();
    this._stateChanged.cancel();
    AbstractJavaScriptComponent._instances.delete(this);
    this.destroy$.next();
    this.destroy$.complete();
  }

  jsDepsInited() {
    this._stateChanged();
  }

  $triggerStateChange() {
    this._stateChanged();
  }

  static triggerGlobalStateChange() {
    AbstractJavaScriptComponent._instances.forEach((instance) =>
      instance._stateChanged(),
    );
  }

  private getResizeObserver() {
    if (!this.resizeObserver) {
      const fireResizeListeners = (el: Element) =>
        this.resizeListeners.get(el)?.forEach((cb) => cb({ element: el }));
      const callback: ResizeObserverCallback = (entries) => {
        entries.map((e) => e.target).forEach(fireResizeListeners);
      };
      this.resizeObserver = new ResizeObserver(callback);
    }
    return this.resizeObserver;
  }
}
