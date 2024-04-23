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
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { Observable, Subject } from 'rxjs';

import { DOCUMENT_ACTIONS_SERVICE } from '@/features/akn-document/akn-document.module';
import {
  IRibbonToolbarItem,
  IRibbonToolbarSection,
} from '@/features/akn-document/models/document-actions.model';
import { DocumentActionsService } from '@/features/akn-document/services/document-actions.service';
import { DocumentService } from '@/shared/services/document.service';

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
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() mainContainerId;
  actionItems$: Observable<IRibbonToolbarSection[]>;
  isToolbarOpen = true;
  resizeSectionsMap: Map<string, boolean> = new Map();
  toolbarPrevWidth: number;
  showToolbarScrollButtons = false;
  observer: ResizeObserver = new ResizeObserver(async () =>
    this.handleResizeToolbar(),
  );

  private sections: NodeListOf<any> = null;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT_ACTIONS_SERVICE)
    private documentActionsService: DocumentActionsService,
    private documentService: DocumentService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.actionItems$ = this.documentActionsService.actionsItems$;
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngAfterViewInit() {
    const container = document.querySelector('.ribbon-toolbar-container');
    console.log('view container ,', container);
    this.initializeSections();
    this.toolbarPrevWidth = container.clientWidth; // Initial width in order to trigger the handling
    this.observer.observe(container);
    await this.setInitialResizing();
  }

  initializeSections() {
    const sections = document.querySelectorAll('.section-content');
    this.resizeSectionsMap = new Map();
    sections.forEach((sec) => {
      this.resizeSectionsMap.set(sec.id, false);
    });
    this.sections = sections;
    console.log('sections map is now:', this.resizeSectionsMap);
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

  private async setInitialResizing() {
    const overflownElements = this.checkIfAnySectionOverflow();
    if (overflownElements.length > 0) {
      await this.handleCaseToolbarIsShorterNow();
    }
  }

  private async handleResizeToolbar() {
    const container = document.querySelector('.ribbon-toolbar-container');
    const currentWidth = container.clientWidth;
    if (!this.sections || this.sections.length === 0) {
      this.initializeSections();
    }
    if (currentWidth > this.toolbarPrevWidth) {
      await this.handleCaseToolbarIsWiderNow();
    } else if (currentWidth < this.toolbarPrevWidth) {
      await this.handleCaseToolbarIsShorterNow();
    } else {
    }

    this.toolbarPrevWidth = currentWidth;
  }

  private async handleCaseToolbarIsWiderNow() {
    let overflownElements = this.checkIfAnySectionOverflow();
    if (this.checkOverflowItemsHaveResized(overflownElements)) {
    } else {
      do {
        const sectionInOrderToBeResized = this.getSectionInOrderResized();
        if (!sectionInOrderToBeResized) {
          return;
        }
        this.resizeSectionsMap.set(sectionInOrderToBeResized.id, false);
        await new Promise((resolve) => setTimeout(resolve, 0));
        overflownElements = this.checkIfAnySectionOverflow();
      } while (!this.checkOverflowItemsHaveResized(overflownElements));
      overflownElements = this.checkIfAnySectionOverflow();
      if (overflownElements.length > 0) {
        const sectionInOrderToBeResized = this.getSectionInOrderResized();
        this.resizeSectionsMap.set(sectionInOrderToBeResized.id, true);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  private async handleCaseToolbarIsShorterNow() {
    const sections = document.querySelectorAll('.section-content');
    let overflowItems = this.checkIfAnySectionOverflow();
    if (this.checkOverflowItemsHaveResized(overflowItems)) {
      do {
        const sectionInOrderToBeResized =
          this.getSectionInOrderToResizeNotResized();
        const getResizeStatusOfSection = this.resizeSectionsMap.get(
          sectionInOrderToBeResized.id,
        );
        if (!getResizeStatusOfSection) {
          if (!sectionInOrderToBeResized) {
            return;
          }
          this.resizeSectionsMap.set(sectionInOrderToBeResized.id, true);
          await new Promise((resolve) => setTimeout(resolve, 0));
          overflowItems = this.checkIfAnySectionOverflow();
        } else {
        }
        overflowItems = this.checkIfAnySectionOverflow();
      } while (this.checkOverflowItemsHaveResized(overflowItems));
    }
    // in case al the elements have been resized and we don't have more space show button t scroll the overflown elements
    if (
      Array.from(this.resizeSectionsMap.values()).filter((value) => !value)
        .length === 0
    ) {
      this.showToolbarScrollButtons = true;
    } else {
      this.showToolbarScrollButtons = false;
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

  private checkIfAnySectionOverflow() {
    const sections = this.sections;
    const overflownElements = Array.from(sections).filter(
      (section) => !this.checkElementIsFullyVisibleInContainer(section.id),
    );
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

  private checkElementIsFullyVisibleInContainer(elementId: string): boolean {
    const container = document.getElementById('toolbar-content-id');
    const element = document.getElementById(elementId);

    if (!element) {
      console.log('Element not found with id', elementId);
      return false;
    }

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return (
      elementRect.left >= containerRect.left &&
      elementRect.right <= containerRect.right
    );
  }
}
