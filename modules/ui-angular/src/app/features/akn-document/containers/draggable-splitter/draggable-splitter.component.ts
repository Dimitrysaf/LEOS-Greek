import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-draggable-splitter',
  templateUrl: './draggable-splitter.component.html',
  styleUrls: ['./draggable-splitter.component.scss'],
})
export class DraggableSplitterComponent implements OnChanges {
  @Input() leftArea: ElementRef;
  @Input() rightArea: ElementRef;
  @Input() isLeftAreaCollapsed: boolean;
  @Input() isRightAreaCollapsed: boolean;
  @Output() hideSplitter = new EventEmitter<boolean>();

  @ViewChild('splitter', { static: true }) splitter: ElementRef;

  isDragging = false;
  minWidth = 200; // Minimum width

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    // If isLeftAreaCollapsed or isRightAreaCollapsed has changed...
    if (changes.isLeftAreaCollapsed || changes.isRightAreaCollapsed) {
      // If the right area or the left area is collapsed remove the flex style from both right and left area
      if (this.isRightAreaCollapsed || this.isLeftAreaCollapsed) {
        this.rightArea.nativeElement.style.flexGrow = '';
        this.rightArea.nativeElement.style.flexShrink = '';
        this.leftArea.nativeElement.style.flexGrow = '';
        this.leftArea.nativeElement.style.flexShrink = '';
        if (
          changes.isLeftAreaCollapsed &&
          changes.leftArea &&
          changes.leftArea.currentValue.nativeElement.className.includes(
            'document-pane',
          ) &&
          changes.leftArea.previousValue.nativeElement.className.includes(
            'compare-mode-pane',
          )
        )
          this.leftArea.nativeElement.style.flexBasis = '';
        setTimeout(() => this.hideSplitter.emit(true));
      }
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    event.preventDefault();
    this.togglePointerEventsNone(true);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.leftArea || !this.rightArea) return;

    const containerRect = this.leftArea.nativeElement.getBoundingClientRect();
    const totalWidth =
      this.leftArea.nativeElement.offsetWidth +
      this.rightArea.nativeElement.offsetWidth;
    const newWidthLeft = event.clientX - containerRect.left;
    const newWidthRight = totalWidth - newWidthLeft;

    if (newWidthLeft < this.minWidth || newWidthRight < this.minWidth) {
      return;
    }

    if (
      this.rightArea.nativeElement.className.includes('annotations-pane') &&
      (this.leftArea.nativeElement.className.includes('compare-mode-pane') ||
        this.leftArea.nativeElement.className.includes(
          'version-for-view-pane',
        ) ||
        this.leftArea.nativeElement.className.includes('document-pane'))
    ) {
      this.rightArea.nativeElement.style.flexBasis = `${newWidthRight}px`;
    } else {
      this.leftArea.nativeElement.style.flexBasis = `${newWidthLeft}px`;
      this.rightArea.nativeElement.style.flexBasis = `${newWidthRight}px`;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;

    if (this.rightArea && this.splitter) {
      // Only clear the 'flex' style from the right area if the mouseup event happened within the splitter
      if (this.splitter.nativeElement.contains(event.target)) {
        this.rightArea.nativeElement.style.flex = '';
      }
    }
    this.togglePointerEventsNone(false);
  }

  private togglePointerEventsNone(disableEvents = true) {
    [this.leftArea?.nativeElement, this.rightArea?.nativeElement]
      .filter(Boolean)
      .forEach((el) => {
        (el as HTMLElement).classList.toggle(
          'app-u-pointer-events-none',
          disableEvents,
        );
      });
  }
}
