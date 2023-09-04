import {
  AfterContentInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-resize-handle',
  templateUrl: './resize-handle.component.html',
  styleUrls: ['./resize-handle.component.scss'],
})
export class ResizeHandleComponent
  implements OnInit, OnDestroy, OnChanges, AfterContentInit
{
  @Input() leftEl: HTMLElement;
  @Input() leftCollapsed = false;
  @Input() leftMinWidth = 200;
  @Input() leftMaxWidth = Number.MAX_VALUE;

  @Input() rightEl: HTMLElement;
  @Input() rightCollapsed = false;
  @Input() rightMinWidth = 200;
  @Input() rightMaxWidth = Number.MAX_VALUE;

  private pointerInitX: number;
  private leftInitWidth: number;
  private rightInitWidth: number;
  private hostWidth: number;
  private removeListeners?: () => void;

  constructor(private hostElRef: ElementRef, private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.endDrag();
  }

  ngAfterContentInit() {
    this.setLeftStyles();
    this.setRightStyles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.leftEl || changes.leftCollapsed) {
      this.setLeftStyles();
    }
    if (changes.rightEl || changes.rightCollapsed) {
      this.setRightStyles();
    }
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    this.startDrag(event);
  }

  private setLeftStyles() {
    if (!this.leftEl) {
      return;
    }
    if (this.leftCollapsed) {
      this.leftEl.style.flexGrow = '';
      this.leftEl.style.flexShrink = '';
    }
  }

  private setRightStyles() {
    if (!this.rightEl) {
      return;
    }
    if (this.rightCollapsed) {
      this.rightEl.style.flexGrow = '';
      this.rightEl.style.flexShrink = '';
    }
  }

  private startDrag(event: PointerEvent) {
    let pointerMoveTimestamp: number;
    const pointerMoveListener = (e: PointerEvent) => {
      window.cancelAnimationFrame(pointerMoveTimestamp);
      pointerMoveTimestamp = window.requestAnimationFrame(() => {
        this.ngZone.runOutsideAngular(() => this.resize(e));
        pointerMoveTimestamp = undefined;
      });
    };
    const pointerUpListener = (e: PointerEvent) => {
      this.ngZone.runOutsideAngular(() => this.endDrag(e));
    };

    const hostEl = this.hostElRef.nativeElement;
    this.pointerInitX = event.clientX;
    this.leftInitWidth = this.leftEl?.getBoundingClientRect().width;
    this.rightInitWidth = this.rightEl?.getBoundingClientRect().width;
    this.hostWidth = hostEl.getBoundingClientRect().width;

    hostEl.addEventListener('pointermove', pointerMoveListener);
    hostEl.addEventListener('pointerup', pointerUpListener);
    hostEl.setPointerCapture(event.pointerId);

    this.removeListeners = () => {
      hostEl.removeEventListener('pointermove', pointerMoveListener);
      hostEl.removeEventListener('pointerup', pointerUpListener);
      window.cancelAnimationFrame(pointerMoveTimestamp);
    };
  }

  private resize(event: PointerEvent) {
    if (this.leftEl && this.rightEl) {
      const totalWidth =
        this.leftInitWidth + this.rightInitWidth + this.hostWidth;
      const leftMaxWidth = Math.min(
        totalWidth - this.rightMinWidth,
        this.leftMaxWidth,
      );
      const leftOffset = event.clientX - this.pointerInitX;
      const leftWidth = this.clampWidth(
        this.leftInitWidth + leftOffset,
        this.leftMinWidth,
        leftMaxWidth,
      );
      this.leftEl.style.flexBasis = `${leftWidth}px`;

      const rightMaxWidth = Math.min(
        totalWidth - this.leftMinWidth,
        this.rightMaxWidth,
      );
      const rightOffset = event.clientX - this.pointerInitX;
      const rightWidth = this.clampWidth(
        this.rightInitWidth - rightOffset,
        this.rightMinWidth,
        rightMaxWidth,
      );
      this.rightEl.style.flexBasis = `${rightWidth}px`;
    } else if (this.leftEl) {
      const leftOffset = event.clientX - this.pointerInitX;
      const leftWidth = this.clampWidth(
        this.leftInitWidth + leftOffset,
        this.leftMinWidth,
        this.leftMaxWidth,
      );
      this.leftEl.style.flexBasis = `${leftWidth}px`;
    } else if (this.rightEl) {
      const rightOffset = event.clientX - this.pointerInitX;
      const rightWidth = this.clampWidth(
        this.rightInitWidth - rightOffset,
        this.rightMinWidth,
        this.rightMaxWidth,
      );
      this.rightEl.style.flexBasis = `${rightWidth}px`;
    }
  }

  private clampWidth(width: number, minWidth: number, maxWidth: number) {
    return Math.min(Math.max(width, minWidth), maxWidth);
  }

  private endDrag(event?: PointerEvent) {
    if (event) {
      this.hostElRef.nativeElement.releasePointerCapture(event.pointerId);
    }
    this.removeListeners?.();
  }
}
