import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

const MIN_SLIDER_TRUE_VALUE = 50;
const MAX_SLIDER_TRUE_VALUE = 108;
const STARTING_VALUE = 100;
const DOCUMENT_WIDTH = 866.5;
const DOCUMENT_HEIGHT = 1628;
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
  private _zoomLevel: number;

  ngOnInit() {
    this._zoomLevel = STARTING_VALUE;
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
    if (actualValue === STARTING_VALUE) {
      return STARTING_VALUE;
    }
    const range = MAX_SLIDER_TRUE_VALUE - MIN_SLIDER_TRUE_VALUE;
    const factor = STARTING_VALUE / range;
    return (actualValue - STARTING_VALUE) * factor + STARTING_VALUE;
  }
}
