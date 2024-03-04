import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

const MIN_DISPLAY_VALUE = 50;
const MAX_DISPLAY_VALUE = 150;
const MIN_SLIDER_TRUE_VALUE = 60;
const MAX_SLIDER_TRUE_VALUE = 140;
const STARTING_VALUE = 100;
const DOCUMENT_WIDTH = 866.5;
const DOCUMENT_HEIGHT = 1628;
const STEP_VALUE = 10;

@Component({
  selector: 'app-zoom-scrollbar',
  templateUrl: './zoom-scrollbar.component.html',
  styleUrls: ['./zoom-scrollbar.component.scss'],
})
export class ZoomScrollbarComponent implements OnInit {
  @Output() zoomChange = new EventEmitter<{
    zoomLevel: number;
    size: { width: number; height: number };
  }>();
  public minDisplayValue: number = MIN_DISPLAY_VALUE;
  public maxDisplayValue: number = MAX_DISPLAY_VALUE;
  private _zoomLevel: number;

  ngOnInit() {
    const middleActualValue =
      (MAX_SLIDER_TRUE_VALUE + MIN_SLIDER_TRUE_VALUE) / 2;
    this._zoomLevel = this.mapActualToDisplay(middleActualValue);
    this.emitZoomChange(this._zoomLevel);
  }

  @Input()
  set zoomLevel(value: number) {
    this._zoomLevel = this.mapActualToDisplay(value);
  }

  get zoomLevel(): number {
    return this._zoomLevel;
  }

  onZoomChange(event: any) {
    const displayValue = event.target.value;
    const actualValue = this.mapDisplayToActual(displayValue);
    this.emitZoomChange(actualValue);
  }

  zoomIn() {
    if (this._zoomLevel + STEP_VALUE > MAX_DISPLAY_VALUE) {
      this._zoomLevel = MAX_DISPLAY_VALUE;
    } else if (this._zoomLevel < MAX_DISPLAY_VALUE) {
      this._zoomLevel += STEP_VALUE;
    }
    this.onZoomChange({ target: { value: this._zoomLevel } });
  }

  zoomOut() {
    if (this._zoomLevel - STEP_VALUE < MIN_DISPLAY_VALUE) {
      this._zoomLevel = MIN_DISPLAY_VALUE;
    } else if (this._zoomLevel > MIN_DISPLAY_VALUE) {
      this._zoomLevel -= STEP_VALUE;
    }
    this.onZoomChange({ target: { value: this._zoomLevel } });
  }

  clearTextSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      }
    } else if ((document as any).selection) {
      (document as any).selection.empty();
    }
  }

  private emitZoomChange(zoomLevel: number) {
    const width = DOCUMENT_WIDTH * (zoomLevel / 100);
    const height = DOCUMENT_HEIGHT * (zoomLevel / 100);

    this.zoomChange.emit({ zoomLevel, size: { width, height } });
  }

  private mapDisplayToActual(displayValue: number): number {
    if (displayValue === STARTING_VALUE) {
      return STARTING_VALUE;
    }
    const range = MAX_SLIDER_TRUE_VALUE - MIN_SLIDER_TRUE_VALUE;
    const factor = range / STARTING_VALUE;
    return (displayValue - STARTING_VALUE) * factor + STARTING_VALUE;
  }

  private mapActualToDisplay(actualValue: number): number {
    const middleActualValue =
      (MAX_SLIDER_TRUE_VALUE + MIN_SLIDER_TRUE_VALUE) / 2;
    const actualRangeHalf = (MAX_SLIDER_TRUE_VALUE - MIN_SLIDER_TRUE_VALUE) / 2;
    const displayRangeHalf = (MAX_DISPLAY_VALUE - MIN_DISPLAY_VALUE) / 2;

    const offsetFromMiddle = actualValue - middleActualValue;

    return (
      STARTING_VALUE + (offsetFromMiddle / actualRangeHalf) * displayRangeHalf
    );
  }
}
