import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { cloneDeep, debounce, throttle } from 'lodash-es';
import { Observable } from 'rxjs';

import { DOCUMENT_ACTIONS_SERVICE } from '@/features/akn-document/akn-document.module';
import { IRibbonToolbarSection } from '@/features/akn-document/models/document-actions.model';
import { DocumentActionsService } from '@/features/akn-document/services/document-actions.service';

import { RibbonToolbarBaseComponent } from '../../components/ribbon-toolbar-base/ribbon-toolbar-base.component';

@Component({
  selector: 'app-ribbon-toolbar-container',
  templateUrl: './ribbon-toolbar-container.component.html',
  styleUrls: ['./ribbon-toolbar-container.component.scss'],
  animations: [
    trigger('toggleToolbarAnimation', [
      state(
        'open',
        style({
          height: '100%',
          opacity: 1,
        }),
      ),
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
        }),
      ),
      transition(
        'open <=> closed',
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class RibbonToolbarContainerComponent
  extends RibbonToolbarBaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  actionItems$: Observable<IRibbonToolbarSection[]>;
  isToolbarOpen = true;
  resizeSectionsMap: Map<string, boolean> = new Map();
  toolbarPrevWidth: number;
  showToolbarScrollButtons = false;
  observer: ResizeObserver;

  constructor(
    @Inject(DOCUMENT_ACTIONS_SERVICE)
    private documentActionsService: DocumentActionsService,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
  ) {
    super();
  }

  ngOnInit(): void {
    this.actionItems$ = this.documentActionsService.actionsItems$;
    this.documentActionsService.documentActionItems.forEach((section) =>
      this.resizeSectionsMap.set(section.id, false),
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.observer.disconnect();
  }

  async ngAfterViewInit() {
    const container = document.querySelector('.ribbon-toolbar-container');
    if (!container) return;
    this.toolbarPrevWidth = container.clientWidth; // Initial width
    const callback = async () => await this.handleResizeToolbar();

    this.observer = new ResizeObserver(callback);
    this.observer.observe(container);
    await this.handleResizeToolbar();
  }

  toggleToolbar() {
    this.isToolbarOpen = !this.isToolbarOpen;
  }

  scrollContent(direction: 'left' | 'right'): void {
    const contentElement = this.document.querySelector(
      '.ribbon-toolbar-content',
    );

    // Calculate the scroll amount based on your design
    const scrollAmount = 100; // Adjust this value as needed

    if (direction === 'left') {
      contentElement.scrollLeft -= scrollAmount;
    } else {
      contentElement.scrollLeft += scrollAmount;
    }
  }

  showScrollContentButton(direction: 'left' | 'right') {
    const contentElement = this.document.querySelector(
      '.ribbon-toolbar-content',
    );

    const isOverflowed =
      contentElement.scrollWidth > contentElement.clientWidth;
    if (direction === 'left') {
      return (
        this.showToolbarScrollButtons &&
        isOverflowed &&
        contentElement.scrollLeft > 0
      );
    }

    if (direction === 'right') {
      return (
        this.showToolbarScrollButtons &&
        isOverflowed &&
        contentElement.scrollLeft <
          contentElement.scrollWidth - contentElement.clientWidth
      );
    }
  }

  private async handleResizeToolbar() {
    const container = document.querySelector('.ribbon-toolbar-container');
    const sections = document.querySelectorAll('.section-container');
    const currentWidth = container.clientWidth;

    if (currentWidth > this.toolbarPrevWidth) {
      await this.handleCaseToolbarIsWiderNow();
    } else if (currentWidth < this.toolbarPrevWidth) {
      await this.handleCaseToolbarIsShorterNow();
    } else {
      console.log('Element width remains the same.');
    }

    // Update the previousWidth for the next comparison
    this.toolbarPrevWidth = currentWidth;
  }

  private async handleCaseToolbarIsWiderNow() {
    const sections = document.querySelectorAll('.section-container');
    console.log('1. Element container has more width now.');
    let overflownElements = this.checkIfAnySectionOverflow(sections);
    if (this.checkOverflowItemsHaveResized(overflownElements)) {
      console.log('1.1. toolbar got wider but still overflows');
    } else {
      console.log(
        '2.1. toolbar getting wider so lets resize elements that where resized : ',
        Array.from(this.resizeSectionsMap).filter((s) => s),
      );
      const sectionInOrderToBeResized = this.getSectionInOrderResized();
      console.log(
        '2.3 item in order to be resized :',
        sectionInOrderToBeResized,
      );
      if (!sectionInOrderToBeResized) {
        console.log('2.3.1 all items have been resized back to normal ');
        return;
      }
      this.resizeSectionsMap.set(sectionInOrderToBeResized.id, false);
      await new Promise((resolve) => setTimeout(resolve, 0));
      overflownElements = this.checkIfAnySectionOverflow(sections);
      if (overflownElements.length > 0) {
        // revert change
        console.log(
          '2.4 despite the overflow element now overflow so resize section with id:',
          sectionInOrderToBeResized.id,
        );
        this.resizeSectionsMap.set(sectionInOrderToBeResized.id, true);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  private async handleCaseToolbarIsShorterNow() {
    const sections = document.querySelectorAll('.section-container');
    console.log('3. Element has less width now.');
    let overflowItems = this.checkIfAnySectionOverflow(sections);
    if (this.checkOverflowItemsHaveResized(overflowItems)) {
      console.log('3.1.1 Some elements still overflow');
      do {
        const sectionInOrderToBeResized =
          this.getSectionInOrderToResizeNotResized();
        const getResizeStatusOfSection = this.resizeSectionsMap.get(
          sectionInOrderToBeResized.id,
        );
        if (!getResizeStatusOfSection) {
          if (!sectionInOrderToBeResized) {
            console.log(
              '3.1.2 All elements have been resized to take less space',
            );
            return;
          }
          this.resizeSectionsMap.set(sectionInOrderToBeResized.id, true);
          await new Promise((resolve) => setTimeout(resolve, 0));
          console.log('3.1.3 Element resized ', sectionInOrderToBeResized.id);
          overflowItems = this.checkIfAnySectionOverflow(sections);
        } else {
          console.log('element already resized');
        }
        overflowItems = this.checkIfAnySectionOverflow(sections);
      } while (this.checkOverflowItemsHaveResized(overflowItems));
      console.log('3.1.4 All elements that where overflowing are now resized');
    }
    // in case al the elements have been resized and we don't have more space show button t scroll the overflown elements
    if (
      Array.from(this.resizeSectionsMap.values()).filter((value) => !value)
        .length === 0
    ) {
      console.log(
        '3.2.1 there no elements to resize, and still overflowing, toggling scroll button',
      );
      this.showToolbarScrollButtons = true;
    }
  }

  private getSectionInOrderToResizeNotResized() {
    const sectionToResizeWithOrder = cloneDeep(
      this.documentActionsService.documentActionItems,
    ).sort((a, b) => a.resizeOrder - b.resizeOrder);

    return sectionToResizeWithOrder.filter(
      (orderSection) => !this.resizeSectionsMap.get(orderSection.id),
    )[0];
  }

  private getSectionInOrderResized() {
    const sectionToResizeWithOrder = cloneDeep(
      this.documentActionsService.documentActionItems,
    ).sort((a, b) => a.resizeOrder - b.resizeOrder);

    return sectionToResizeWithOrder.filter((orderSection) =>
      this.resizeSectionsMap.get(orderSection.id),
    )[0];
  }

  private checkIfAnySectionOverflow(sections: NodeListOf<any>) {
    const visibleElements = Array.from(sections).filter((section) =>
      this.checkElementIsFullyVisible(section.id),
    );

    const notVisible = Array.from(sections).filter(
      (section) => !this.checkElementIsFullyVisible(section.id),
    );
    console.log('visible elements are:', visibleElements);
    console.log('non visible elements are:', notVisible);
    const overflownElements = Array.from(sections).filter(
      (section) => !this.checkElementIsFullyVisible(section.id),
    );
    console.log('elements that are overflown are : ', overflownElements);

    return overflownElements;
  }

  private checkOverflowItemsHaveResized(overflownItems: any[]) {
    return (
      overflownItems.filter((item) => !this.resizeSectionsMap.get(item.id))
        .length > 0
    );
  }

  private isOverflown(elementId: string): boolean {
    const element = document.getElementById(elementId);

    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }

  private checkElementIsFullyVisible(elementId: string): boolean {
    const element = document.getElementById(elementId);

    if (!element) console.log('not found element with id', elementId);
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
