import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMoveToLeftSideToolbar]',
})
export class MoveToLeftSideToolbarDirective implements AfterViewInit {
  @Input('appMoveToLeftSideToolbar') targetClass: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
      if (this.targetClass) {
        const targetElement = document.querySelector(`.${this.targetClass}`);
        if (targetElement) {
          this.renderer.appendChild(targetElement, this.el.nativeElement);
        }
      }
  }
}

