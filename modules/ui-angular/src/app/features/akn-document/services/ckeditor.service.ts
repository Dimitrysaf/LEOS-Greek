/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { AppConfigService } from '@/core/services/app-config.service';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { LeosAppConfig } from '@/shared';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import { DocumentService } from '@/shared/services/document.service';

import { TocItem } from '../models/toc.model';

// FIXME: mockdata
// TODO This must be fetch from a backend Api. Keep in mind that aktTag must always be lowercase
const tocItemsList = [
  {
    aknTag: 'preface',
    root: true,
    higherElement: null,
    draggable: false,
    childrenAllowed: false,
    display: true,
    itemNumber: 'NONE',
    autoNumbering: null,
    itemHeading: 'NONE',
    itemDescription: true,
    numberEditable: false,
    contentDisplayed: false,
    deletable: false,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'NONE',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'mainbody',
    root: true,
    higherElement: null,
    draggable: false,
    childrenAllowed: true,
    display: true,
    itemNumber: 'NONE',
    autoNumbering: null,
    itemHeading: 'NONE',
    itemDescription: true,
    numberEditable: false,
    contentDisplayed: false,
    deletable: false,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'NONE',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'part',
    rootl: false,
    higherElementl: true,
    draggablel: true,
    childrenAllowedl: true,
    displayl: true,
    itemNumberl: 'MANDATORY',
    autoNumberingl: false,
    itemHeadingl: 'MANDATORY',
    itemDescriptionl: true,
    numberEditablel: true,
    contentDisplayedl: false,
    deletablel: true,
    numWithTypel: true,
    expandedByDefaultl: true,
    sameParentAsChildl: false,
    numberingTypel: 'ROMAN_UPPER',
    tocItemTypesl: null,
    parentNameNumberingTypeDependencyl: null,
    profilesl: null,
    editablel: false,
    addSoftAttrl: null,
    template:
      // eslint-disable-next-line no-template-curly-in-string
      '<part xml:id="_${id}"><num>${num}</num><heading>${heading}</heading></part>',
    maxDepthl: null,
    actionsPositionl: null,
  },
  {
    aknTag: 'title',
    root: false,
    higherElement: true,
    draggable: true,
    childrenAllowed: true,
    display: true,
    itemNumber: 'MANDATORY',
    autoNumbering: false,
    itemHeading: 'MANDATORY',
    itemDescription: true,
    numberEditable: true,
    contentDisplayed: false,
    deletable: true,
    numWithType: true,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'ROMAN_UPPER',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template:
      // eslint-disable-next-line no-template-curly-in-string
      '<title xml:id="_${id}"><num>${num}</num><heading>${heading}</heading></title>',
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'chapter',
    root: false,
    higherElement: true,
    draggable: true,
    childrenAllowed: true,
    display: true,
    itemNumber: 'MANDATORY',
    autoNumbering: false,
    itemHeading: 'MANDATORY',
    itemDescription: true,
    numberEditable: true,
    contentDisplayed: false,
    deletable: true,
    numWithType: true,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'HIGHER_ELEMENT_NUM',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template:
      // eslint-disable-next-line no-template-curly-in-string
      '<chapter xml:id="_${id}"><num>${num}</num><heading>${heading}</heading></chapter>',
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'section',
    root: false,
    higherElement: true,
    draggable: true,
    childrenAllowed: true,
    display: true,
    itemNumber: 'MANDATORY',
    autoNumbering: false,
    itemHeading: 'MANDATORY',
    itemDescription: true,
    numberEditable: true,
    contentDisplayed: false,
    deletable: true,
    numWithType: true,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'ARABIC_PARENTHESIS',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template:
      // eslint-disable-next-line no-template-curly-in-string
      '<section xml:id="_${id}"><num>${num}</num><heading>${heading}</heading></section>',
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'heading',
    root: false,
    higherElement: null,
    draggable: false,
    childrenAllowed: false,
    display: false,
    itemNumber: 'NONE',
    autoNumbering: null,
    itemHeading: 'NONE',
    itemDescription: true,
    numberEditable: false,
    contentDisplayed: false,
    deletable: false,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'NONE',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: {
      profiles: [
        {
          elementSelector: 'heading:not(level heading)',
          profileName: 'inlineAknHeading',
        },
      ],
    },
    editable: true,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'level',
    root: false,
    higherElement: null,
    draggable: true,
    childrenAllowed: true,
    display: true,
    itemNumber: 'MANDATORY',
    autoNumbering: true,
    itemHeading: 'OPTIONAL',
    itemDescription: false,
    numberEditable: false,
    contentDisplayed: true,
    deletable: true,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'LEVEL_NUM',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: {
      profiles: [
        {
          elementSelector: null,
          profileName: 'inlineAknLevel',
        },
      ],
    },
    editable: true,
    addSoftAttr: null,
    template: null,
    maxDepth: '7',
    actionsPosition: null,
  },
  {
    aknTag: 'paragraph',
    root: false,
    higherElement: null,
    draggable: true,
    childrenAllowed: true,
    display: true,
    itemNumber: 'NONE',
    autoNumbering: null,
    itemHeading: 'NONE',
    itemDescription: false,
    numberEditable: false,
    contentDisplayed: true,
    deletable: true,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'ARABIC_POSTFIXDOT',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: {
      profiles: [
        {
          elementSelector: null,
          profileName: 'inlineAknParagraph',
        },
      ],
    },
    editable: true,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'subparagraph',
    root: false,
    higherElement: null,
    draggable: false,
    childrenAllowed: false,
    display: false,
    itemNumber: 'NONE',
    autoNumbering: null,
    itemHeading: 'NONE',
    itemDescription: false,
    numberEditable: false,
    contentDisplayed: true,
    deletable: true,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'NONE',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'list',
    root: false,
    higherElement: null,
    draggable: false,
    childrenAllowed: true,
    display: false,
    itemNumber: 'NONE',
    autoNumbering: null,
    itemHeading: 'NONE',
    itemDescription: true,
    numberEditable: false,
    contentDisplayed: false,
    deletable: true,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'NONE',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'point',
    root: false,
    higherElement: null,
    draggable: false,
    childrenAllowed: true,
    display: false,
    itemNumber: 'MANDATORY',
    autoNumbering: true,
    itemHeading: 'NONE',
    itemDescription: false,
    numberEditable: false,
    contentDisplayed: true,
    deletable: true,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: true,
    numberingType: 'POINT_NUM',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'indent',
    root: false,
    higherElement: null,
    draggable: false,
    childrenAllowed: false,
    display: false,
    itemNumber: 'MANDATORY',
    autoNumbering: true,
    itemHeading: 'NONE',
    itemDescription: false,
    numberEditable: false,
    contentDisplayed: true,
    deletable: true,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: true,
    numberingType: 'POINT_NUM',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
  {
    aknTag: 'alinea',
    root: false,
    higherElement: null,
    draggable: false,
    childrenAllowed: false,
    display: false,
    itemNumber: 'NONE',
    autoNumbering: null,
    itemHeading: 'NONE',
    itemDescription: false,
    numberEditable: false,
    contentDisplayed: true,
    deletable: true,
    numWithType: false,
    expandedByDefault: true,
    sameParentAsChild: false,
    numberingType: 'NONE',
    tocItemTypes: null,
    parentNameNumberingTypeDependency: null,
    profiles: null,
    editable: false,
    addSoftAttr: null,
    template: null,
    maxDepth: null,
    actionsPosition: null,
  },
];
const numberingConfigsJsonArray = [
  {
    type: 'HIGHER_ELEMENT_NUM',
    numbered: true,
    prefix: '',
    suffix: '',
    sequence: '1',
    description: '1, 2, etc',
    regex:
      '#|^(?!([a-z]))((^([1-9][0-9]*)|M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))([a-z])*)',
    msgValidationError: 'subdivision.num.config.validation.error.message',
    levels: null,
    level: null,
  },
  {
    type: 'ARABIC',
    numbered: true,
    prefix: '',
    suffix: '',
    sequence: '1',
    description: '1, 2, etc',
    regex: '\\d+$|#',
    msgValidationError: 'arabic.num.config.validation.error.message',
    levels: null,
    level: null,
  },
  {
    type: 'ARABIC_POSTFIXDOT',
    numbered: true,
    prefix: '',
    suffix: '.',
    sequence: '1',
    description: '1., 2., etc',
    regex: '\\d+$|#',
    msgValidationError: 'arabic.num.config.validation.error.message',
    levels: null,
    level: null,
  },
  {
    type: 'ARABIC_PARENTHESIS',
    numbered: true,
    prefix: '(',
    suffix: ')',
    sequence: '1',
    description: '(1), (2), etc',
    regex: '\\d+$|#',
    msgValidationError: 'arabic.num.config.validation.error.message',
    levels: null,
    level: null,
  },
  {
    type: 'ALPHA_LOWER_PARENTHESIS',
    numbered: true,
    prefix: '(',
    suffix: ')',
    sequence: 'a',
    description: '(a), (b), etc',
    regex: '[a-z]+$|#',
    msgValidationError: null,
    levels: null,
    level: null,
  },
  {
    type: 'ROMAN_LOWER_PARENTHESIS',
    numbered: true,
    prefix: '(',
    suffix: ')',
    sequence: 'i',
    description: '(i), (ii), etc',
    regex: 'm{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$|#',
    msgValidationError: 'roman.num.config.validation.error.message',
    levels: null,
    level: null,
  },
  {
    type: 'ROMAN_UPPER',
    numbered: true,
    prefix: '',
    suffix: '',
    sequence: 'I',
    description: 'I, II, etc',
    regex: 'M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$|#',
    msgValidationError: 'roman.num.config.validation.error.message',
    levels: null,
    level: null,
  },
  {
    type: 'INDENT',
    numbered: false,
    prefix: '',
    suffix: '',
    sequence: '-',
    description: '-, -, etc for all points',
    regex: null,
    msgValidationError: null,
    levels: null,
    level: null,
  },
  {
    type: 'NONE',
    numbered: false,
    prefix: null,
    suffix: null,
    sequence: null,
    description: null,
    regex: null,
    msgValidationError: null,
    levels: null,
    level: null,
  },
  {
    type: 'POINT_NUM',
    numbered: true,
    prefix: null,
    suffix: null,
    sequence: null,
    description: null,
    regex: null,
    msgValidationError: null,
    levels: {
      levels: [
        { depth: 1, numberingType: 'ALPHA_LOWER_PARENTHESIS' },
        { depth: 2, numberingType: 'ROMAN_LOWER_PARENTHESIS' },
        { depth: 3, numberingType: 'ARABIC_PARENTHESIS' },
        { depth: 4, numberingType: 'INDENT' },
      ],
    },
    level: null,
  },
  {
    type: 'LEVEL_NUM',
    numbered: true,
    prefix: null,
    suffix: null,
    sequence: null,
    description:
      'Use different numbering based on the depth. Ex: 1., 1.1, 1.1.1, 1.1.1.1',
    regex: null,
    msgValidationError: null,
    levels: {
      levels: [
        { depth: 1, numberingType: 'ARABIC_POSTFIXDOT' },
        { depth: 2, numberingType: 'ARABIC_POSTFIXDOT' },
        { depth: 3, numberingType: 'ARABIC_POSTFIXDOT' },
        { depth: 4, numberingType: 'ARABIC_POSTFIXDOT' },
        { depth: 5, numberingType: 'ARABIC_POSTFIXDOT' },
        { depth: 6, numberingType: 'ARABIC_POSTFIXDOT' },
        { depth: 7, numberingType: 'ARABIC_POSTFIXDOT' },
      ],
    },
    level: null,
  },
];
const listNumberConfigJsonArray = {
  REGULAR: [
    { depth: 1, numberingType: 'ALPHA_LOWER_PARENTHESIS' },
    { depth: 2, numberingType: 'ROMAN_LOWER_PARENTHESIS' },
    { depth: 3, numberingType: 'ARABIC_PARENTHESIS' },
    { depth: 4, numberingType: 'INDENT' },
  ],
};
const documentsMetadataJsonArray = [
  {
    category: 'MEMORANDUM',
    stage: 'Proposal for a',
    type: 'REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL',
    purpose: 'on XYZ',
    template: 'SJ-023',
    language: 'EN',
    docTemplate: 'EM-LP01',
    ref: 'memorandum',
    objectId: null,
    docVersion: '0.1.0',
    eeaRelevance: false,
  },
  {
    category: 'BILL',
    stage: 'Proposal for a',
    type: 'REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL',
    purpose: 'on XYZ',
    template: 'SJ-023',
    language: 'EN',
    docTemplate: 'BL-023',
    ref: 'bill',
    objectId: null,
    docVersion: '0.1.0',
    eeaRelevance: false,
  },
  {
    category: 'ANNEX',
    stage: 'Proposal for a',
    type: 'REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL',
    purpose: 'on XYZ',
    template: 'SJ-023',
    language: 'EN',
    docTemplate: 'SG-017',
    ref: 'annex_1',
    objectId: null,
    docVersion: '0.1.0',
    eeaRelevance: false,
    index: 1,
    number: 'Annex 1',
    title: 'Title of annex 1',
    clonedRef: null,
  },
  {
    category: 'ANNEX',
    stage: 'Proposal for a',
    type: 'REGULATION OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL',
    purpose: 'on XYZ',
    template: 'SJ-023',
    language: 'EN',
    docTemplate: 'SG-017',
    ref: 'annex_2',
    objectId: null,
    docVersion: '0.1.0',
    eeaRelevance: false,
    index: 2,
    number: 'Annex 2',
    title: 'Title of annex 2',
    clonedRef: null,
  },
];
const params = {
  elementId: '_body_level_1',
  elementType: 'level',
  elementFragment: `<level leos:depth="1" xml:id="_body_level_1">
                <num xml:id="_body_level_1_num">1.</num>
                <content xml:id="_body_level_1_content">
                    <p id="_body_level_1_content_p">Text...</p>
                </content>
            </level>`,
  docType: 'annex',
  instanceType: 'OS',
  alternatives: '',
  levelItemVo:
    '{"id":"_body_level_1","levelNum":"1.","levelDepth":1,"origin":null,"children":[{"id":"_body_level_1_1","levelNum":"1.1.","levelDepth":2,"origin":null,"children":[]}]}',
  isClonedProposal: false,
};
type ResizeListener<T extends Element = Element> = (event: {
  element: T;
}) => void;

@Injectable({
  providedIn: 'root',
})
export class CKEditorService implements OnDestroy {
  private annexRefBS = new BehaviorSubject<string>(null);
  private documentRefBS = new BehaviorSubject<string>(null);
  private xmlBS = new BehaviorSubject<string>('');
  private documentTypeBS = new BehaviorSubject<string>(null);
  private resizeObserver?: ResizeObserver;
  resizeListeners = new Map<Element, Set<ResizeListener>>();
  elementEditor$: Observable<any>;
  xml$ = this.xmlBS.asObservable();
  documentRef$ = this.documentRefBS.asObservable();
  annexRef$ = this.annexRefBS.asObservable();
  documentType$ = this.documentTypeBS.asObservable();

  connector: any = {
    getParentId: () => 123,
    getElement: (...args) => document.getElementById('docContainer'),
    getState: () => ({
      ...this.leosStateBS.value,
      instanceType: process.env.NG_APP_LEOS_INSTANCE,
      alternateConfigsJsonArray: JSON.stringify('[]'),
    }),
    editElementAction: (data: {
      action: string;
      elementId: string;
      elementType: string;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.getDocumentElement(
        documentRef,
        data.elementId,
        data.elementType.toLowerCase(),
        documentType,
      )
        .pipe(distinctUntilChanged())
        .subscribe((response) => {
          //TODO this will be removed after correct implementation of calls to get docType,instanceType, alternatives and isClonedProposal
          const {
            elementId,
            elementType,
            elementFragment,
            docType,
            instanceType,
            alternatives,
            levelItemVo,
            isClonedProposal,
          } = params;

          const res = JSON.parse(response);

          this.connector.editElement(
            res.elementId,
            res.elementTagName,
            res.element,
            documentType,
            process.env.NG_APP_LEOS_INSTANCE,
            alternatives,
            JSON.stringify(res.levelItem),
            isClonedProposal,
          );
        });
    },
    saveElement: (elemData: {
      elementId: string;
      elementType: string;
      elementFragment: string;
      isSplit: boolean;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.saveDocumentElement(
        documentRef,
        elemData.elementId,
        elemData.elementType,
        elemData.elementFragment,
        elemData.isSplit,
        documentType,
      ).subscribe((response) => {
        this.documentService.setDocumentId(documentRef);
      });
    },
    closeElement: () => {},

    addResizeListener: <T extends Element>(
      element: T,
      callbackFunction: ResizeListener<T>,
    ) => {
      if (!this.resizeListeners.has(element)) {
        this.resizeListeners.set(element, new Set());
        this.getResizeObserver().observe(element);
      }
      this.resizeListeners.get(element).add(callbackFunction);
    },
    removeResizeListener: <T extends Element>(
      element: T,
      callbackFunction: ResizeListener<T>,
    ) => {
      if (this.resizeListeners.has(element)) {
        this.resizeListeners.get(element).delete(callbackFunction);
        if (this.resizeListeners.get(element).size === 0) {
          this.resizeListeners.delete(element);
          this.resizeObserver?.unobserve(element);
        }
      }
    },
    releaseElement: () => {
      const documentRef = this.documentRefBS.value;
      this.documentService.setDocumentId(documentRef);
    },
    deleteElementAction: (elementData: {
      action: string;
      elementId: string;
      elementType: string;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.deleteDocumentElement(
        documentRef,
        elementData.elementType,
        elementData.elementId,
        documentType,
      ).subscribe((response) => {
        this.documentService.setDocumentId(documentRef);
      });
    },
    insertElementAction: (elementData: {
      action: string;
      elementId: string;
      elementType: string;
      position: string;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.insertDocumentElement(
        documentRef,
        elementData.elementType,
        elementData.elementId,
        documentType,
        elementData.position,
      )
        .pipe(distinctUntilChanged())
        .subscribe((response) => {
          this.documentService.setDocumentId(documentRef);
          this.documentService.getToc(documentRef);
          // this.documentService.getToc(documentRef);
        });
    },
    mergeElement: (elementData: {
      elementId: string;
      elementType: string;
      elementContent: string;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.mergeDocumentElement(
        documentRef,
        documentType,
        elementData.elementId,
        elementData.elementType,
        elementData.elementContent,
      );
    },
  };

  private destroy$ = new Subject<void>();
  private leosStateBS = new BehaviorSubject<any | null>(null);

  constructor(
    private leosLegacyService: LeosLegacyService,
    private http: HttpClient,
    private documentService: DocumentService,
    private appConfig: AppConfigService,
  ) {
    this.appConfig.config
      .pipe(
        combineLatestWith(this.getConnectorExtraConfig()),
        mergeMap(([config, extraConfig]) => of({ ...config, ...extraConfig })),
      )
      .subscribe((c) => {
        console.log(c);
        this.renameConfigKeysForEditor(c);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  init() {
    this.leosLegacyService.require$.pipe(take(1)).subscribe((require) => {
      require(['js/leosModulesBootstrap']);
    });

    const actionManagerExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/actionManagerExtension'], (actionManager) => {
              subscriber.next(actionManager);
            });
          }),
      ),
    );
    const refToLinkExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/refToLinkExtension'], (refToLink) => {
              subscriber.next(refToLink);
            });
          }),
      ),
    );

    const leosEditorExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/editor/leosEditorExtension'], (leosEditor) => {
              subscriber.next(leosEditor);
            });
          }),
      ),
    );

    const softActionsExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/softActionsExtension'], (softActions) => {
              subscriber.next(softActions);
            });
          }),
      ),
    );

    const changeDetailsExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/changeDetailsExtension'], (changeDetails) => {
              subscriber.next(changeDetails);
            });
          }),
      ),
    );

    const leosConfig$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/core/leosConfig'], (leosConfig) => {
              subscriber.next(leosConfig);
            });
          }),
      ),
    );

    const actionHandler$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/editor/core/actionHandler'], (actionHandler) => {
              subscriber.next(actionHandler);
            });
          }),
      ),
    );

    const toolbarPositionAdapter$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/editor/core/toolbarPositionAdapter'], (
              toolbarPositionAdapter,
            ) => {
              subscriber.next(toolbarPositionAdapter);
            });
          }),
      ),
    );

    const inlineLeosEditor$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require([
              'js/editor/plugins/leosInlineEditor/leosInlineEditorPlugin',
            ], (inlineLeosEditor) => {
              subscriber.next(inlineLeosEditor);
            });
          }),
      ),
    );

    this.elementEditor$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/editor/core/elementEditor'], (elementEditor) => {
              subscriber.next(elementEditor);
            });
          }),
      ),
    );

    combineLatest([
      actionManagerExtension$,
      refToLinkExtension$,
      leosEditorExtension$,
      softActionsExtension$,
      changeDetailsExtension$,
      actionHandler$,
      toolbarPositionAdapter$,
      this.elementEditor$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([
          actionManager,
          refTolink,
          leosEditor,
          softActions,
          changeDetails,
          actionHandler,
          toolbarPositionAdapter,
          elementEditor,
        ]: any[]) => {
          actionManager.init(this.connector);
          refTolink.init(this.connector);
          leosEditor.init(this.connector);
          softActions.init(this.connector);
          changeDetails.init(this.connector);
          actionHandler.setup(this.connector);
          toolbarPositionAdapter.setup(this.connector);
          elementEditor.setup(this.connector);
        },
      );
  }

  saveDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    elementFragment: string,
    isSplit: boolean,
    documentType: string,
  ) {
    return this.http
      .put(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementType}/${elementId}/save-element`,
        elementFragment,
        { responseType: 'text', headers: { contentType: 'text' } },
      )
      .pipe(
        tap(() => {
          this.documentService.getToc(this.annexRefBS.value);
        }),
        tap(() => this.connector.closeElement()),
      );
  }

  setXml(xml: string) {
    this.xmlBS.next(xml);
  }

  setDocumentRef(documentRef: string) {
    this.documentRefBS.next(documentRef);
  }

  setDocumentType(documentType: string) {
    this.documentTypeBS.next(documentType);
  }

  setAnnexRef(annexRef: string) {
    this.annexRefBS.next(annexRef);
  }

  getDocumentElement(
    documentRef: string,
    elementName: string,
    elementId: string,
    documentType: string,
  ) {
    return this.http.get(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}`,
      { responseType: 'text' },
    );
  }

  deleteDocumentElement(
    documentRef: string,
    elementName: string,
    elementId: string,
    documentType: string,
  ) {
    return this.http.delete(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}`,
      { responseType: 'arraybuffer' },
    );
  }

  insertDocumentElement(
    documentRef: string,
    elementName: string,
    elementId: string,
    documentType: string,
    position: string,
  ) {
    return this.http.put(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}/insert-element`,
      { position: position.toUpperCase() },
      { responseType: 'arraybuffer' },
    );
  }

  mergeDocumentElement(
    documentRef: string,
    documentType: string,
    elementId: string,
    elementName: string,
    elementContent: string,
  ) {
    this.documentService.documentView$ = this.http.put<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}/merge-element`,
      { elementContent },
    );
  }

  private getResizeObserver() {
    if (!this.resizeObserver) {
      const fireResizeListeners = (el: Element) =>
        this.resizeListeners.get(el)?.forEach((cb) => cb({ element: el }));
      const callback: ResizeObserverCallback = (entries) => {
        entries.map((e) => e.target).forEach(fireResizeListeners);
      };
      this.resizeObserver = new ResizeObserver(callback);
    }
    return this.resizeObserver;
  }

  private getConnectorExtraConfig() {
    return this.documentService.documentId$.pipe(
      takeUntil(this.destroy$),
      filter((x) => x !== null),
      combineLatestWith(this.documentService.documentCategory$),
      mergeMap(([documentRef, documentType]) =>
        this.http.get<any>(
          `${apiBaseUrl}/secured/${documentType}/${documentRef}/document-config`,
        ),
      ),
    );
  }

  private renameConfigKeysForEditor(config: any) {
    //toc-items
    Object.defineProperty(
      config,
      'tocItemsJsonArray',
      Object.getOwnPropertyDescriptor(config, 'tocItems'),
    );
    const tocArray = config.tocItems;
    config.tocItemsJsonArray = JSON.stringify(tocArray);
    delete config['tocItems'];

    //numberingConfigsJsonArray
    Object.defineProperty(
      config,
      'numberingConfigsJsonArray',
      Object.getOwnPropertyDescriptor(config, 'numberingConfig'),
    );
    const numConfigArray = config.numberingConfig;
    config.numberingConfigsJsonArray = JSON.stringify(numConfigArray);
    delete config['numberingConfig'];

    //listNumberConfigJsonArray
    const tmplistNumberConfigJsonArray = config.listNumberConfigJsonArray;
    config.listNumberConfigJsonArray = JSON.stringify(
      tmplistNumberConfigJsonArray,
    );

    //articleTypesConfig
    Object.defineProperty(
      config,
      'articleTypesConfigJsonArray',
      Object.getOwnPropertyDescriptor(config, 'articleTypesConfig'),
    );
    const articleTypesConfigObj = config.articleTypesConfig;
    config.articleTypesConfigJsonArray = JSON.stringify(articleTypesConfigObj);
    delete config['articleTypesConfig'];

    //documentsMetadata
    Object.defineProperty(
      config,
      'documentsMetadataJsonArray',
      Object.getOwnPropertyDescriptor(config, 'documentsMetadata'),
    );
    const documentsMetadataJsonArrayVal = config.documentsMetadata;
    config.documentsMetadataJsonArray = JSON.stringify(
      documentsMetadataJsonArrayVal,
    );
    delete config['documentsMetadata'];

    this.leosStateBS.next(config);
  }
}
