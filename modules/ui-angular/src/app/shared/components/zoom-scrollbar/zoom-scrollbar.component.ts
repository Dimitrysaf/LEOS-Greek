import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RibbonToolbarBaseComponent } from '@/features/akn-document/components/ribbon-toolbar-base/ribbon-toolbar-base.component';
import {
  IRibbonToolbarCheckbox
} from '@/features/akn-document/models/document-actions.model';
import { ZoombarService } from '@/shared/services/zoombar.service';

const MIN_DISPLAY_VALUE = 50;
const MAX_DISPLAY_VALUE = 150;
const DOCUMENT_WIDTH = 866.5;
const DOCUMENT_HEIGHT = 1628;

@Component({
  selector: 'app-zoom-scrollbar',
  templateUrl: './zoom-scrollbar.component.html',
  styleUrls: ['./zoom-scrollbar.component.scss'],
})
export class ZoomScrollbarComponent
  extends RibbonToolbarBaseComponent<IRibbonToolbarCheckbox>
  implements OnInit
{
  @Output() zoomChange = new EventEmitter<{
    mainContainerId: string;
    zoomLevel: number;
    size: { width: number; height: number };
  }>();
  @Input() mainContainerId: string;
  public minDisplayValue: number = MIN_DISPLAY_VALUE;
  public maxDisplayValue: number = MAX_DISPLAY_VALUE;
  private _zoomLevel: number;

  constructor(public zoombarService: ZoombarService) {
    super();
  }
  ngOnInit() {}

  @Input()
  set zoomLevel(value: number) {
    this._zoomLevel = this.zoombarService.mapActualToDisplay(value);
  }

  get zoomLevel(): number {
    return this._zoomLevel;
  }

  zoomIn() {
    this.zoombarService.zoomIn(this.mainContainerId);
  }

  zoomOut() {
    this.zoombarService.zoomOut(this.mainContainerId);
  }

  onZoomChange(event: any) {
    this.zoombarService.onZoomChange(this.mainContainerId, event);
  }

  emitZoomChange(zoomLevel: number) {
    const scaleFactor = zoomLevel / 100;
    const width = DOCUMENT_WIDTH * scaleFactor;
    const height = DOCUMENT_HEIGHT * scaleFactor;

    this.zoomChange.emit({
      mainContainerId: this.mainContainerId,
      zoomLevel,
      size: { width, height },
    });
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
}
