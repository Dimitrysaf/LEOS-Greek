import { EventEmitter, Injectable } from '@angular/core';

const MIN_DISPLAY_VALUE = 50;
const MAX_DISPLAY_VALUE = 150;
const MIN_SLIDER_TRUE_VALUE = 60;
const MAX_SLIDER_TRUE_VALUE = 140;
const STARTING_VALUE = 100;
const DOCUMENT_WIDTH = 866.5;
const DOCUMENT_HEIGHT = 1628;
const STEP_VALUE = 10;
@Injectable({
  providedIn: 'root',
})
export class ZoombarService {
  zoomChange = new EventEmitter<{
    mainContainerId: string;
    zoomLevel: number;
    size: { width: number; height: number };
  }>();
  private zoomLevels: Map<string, number> = new Map();

  constructor() {}

  getZoomLevel(mainContainerId: string): number {
    return this.zoomLevels.get(mainContainerId) || STARTING_VALUE;
  }

  zoomIn(mainContainerId: string) {
    const currentZoom = this.zoomLevels.get(mainContainerId) || STARTING_VALUE;
    const newZoomLevel =
      currentZoom + STEP_VALUE > MAX_DISPLAY_VALUE
        ? MAX_DISPLAY_VALUE
        : currentZoom + STEP_VALUE;
    this.setZoomLevel(mainContainerId, newZoomLevel);
  }

  zoomOut(mainContainerId: string) {
    const currentZoom = this.zoomLevels.get(mainContainerId) || STARTING_VALUE;
    const newZoomLevel =
      currentZoom - STEP_VALUE < MIN_DISPLAY_VALUE
        ? MIN_DISPLAY_VALUE
        : currentZoom - STEP_VALUE;
    this.setZoomLevel(mainContainerId, newZoomLevel);
  }

  onZoomChange(mainContainerId: string, event: any) {
    const newZoomLevel = +event.target.value;
    this.setZoomLevel(mainContainerId, newZoomLevel);
  }

  setZoomLevel(mainContainerId: string, zoomLevel: number) {
    this.zoomLevels.set(mainContainerId, zoomLevel);
    this.emitZoomChange(mainContainerId, zoomLevel);
  }

  emitZoomChange(mainContainerId: string, zoomLevel: number) {
    const scaleFactor = zoomLevel / 100;
    const width = DOCUMENT_WIDTH * scaleFactor;
    const height = DOCUMENT_HEIGHT * scaleFactor;

    this.zoomChange.emit({
      mainContainerId,
      zoomLevel,
      size: { width, height },
    });
  }

  mapDisplayToActual(displayValue: number): number {
    if (displayValue === STARTING_VALUE) {
      return STARTING_VALUE;
    }
    const range = MAX_SLIDER_TRUE_VALUE - MIN_SLIDER_TRUE_VALUE;
    const factor = range / STARTING_VALUE;
    return (displayValue - STARTING_VALUE) * factor + STARTING_VALUE;
  }

  mapActualToDisplay(actualValue: number): number {
    const middleActualValue =
      (MAX_SLIDER_TRUE_VALUE + MIN_SLIDER_TRUE_VALUE) / 2;
    const actualRangeHalf = (MAX_SLIDER_TRUE_VALUE - MIN_SLIDER_TRUE_VALUE) / 2;
    const displayRangeHalf = (MAX_DISPLAY_VALUE - MIN_DISPLAY_VALUE) / 2;

    const offsetFromMiddle = actualValue - middleActualValue;

    return (
      STARTING_VALUE + (offsetFromMiddle / actualRangeHalf) * displayRangeHalf
    );
  }

  calculateSize(zoomLevel: number): { width: number; height: number } {
    const scaleFactor = zoomLevel / 100;
    const width = DOCUMENT_WIDTH * scaleFactor;
    const height = DOCUMENT_HEIGHT * scaleFactor;
    return { width, height };
  }

  resetAllZoomLevels() {
    this.zoomLevels.forEach((_, mainContainerId) => {
      this.setZoomLevel(mainContainerId, 100);
    });
  }
}
