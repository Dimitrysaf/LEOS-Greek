import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appHideOnClickOutside]',
})
export class HideOnClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<MouseEvent>();
  @Input() ignoreClickOn: string[];

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const shouldIgnore = this.ignoreClickOn.some((selector) =>
      targetElement.closest(selector),
    );
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);

    if (!clickedInside && !shouldIgnore) {
      this.appClickOutside.emit(event);
    }
  }
}
