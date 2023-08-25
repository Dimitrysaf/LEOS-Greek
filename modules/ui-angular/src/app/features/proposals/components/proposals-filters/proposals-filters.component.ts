import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { getI18nState } from '@eui/core';
import { ProcedureType, Role } from '@leos/shared';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  skip,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';

import {
  MAX_TRUNCATION_LIMIT,
  ONE_LINE_NODE_LABEL_LENGTH,
} from '@/shared/constants/toc.constant';

import {
  CatalogItem,
  FilterOption,
  ProposalFilter,
  ProposalFilterGroup,
} from '../../models';
import { ProposalService } from '../../services/proposal.service';

@Component({
  selector: 'app-proposals-filters',
  templateUrl: './proposals-filters.component.html',
  styleUrls: ['./proposals-filters.component.scss'],
})
export class ProposalsFiltersComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private static get emptyFilterParams(): ProposalFilter {
    return {
      searchTerm: '',
      procedures: [],
      acts: [],
      templates: [],
      roles: [],
    };
  }

  @ViewChild('filtersContainer') filtersContainer: ElementRef<HTMLElement>;
  filterGroups: ProposalFilterGroup[] = [];
  form: FormGroup;

  private resizeObserver: ResizeObserver;
  private formChangesSub: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private translateService: TranslateService,
    private store: Store<any>,
  ) {}

  ngOnInit(): void {
    const templateCatalog$ = this.proposalService.templateCatalog$.pipe(
      takeUntil(this.destroy$),
    );
    const i18nState$ = this.store
      .select(getI18nState)
      .pipe(takeUntil(this.destroy$));
    const filters$ = this.proposalService.filters$.pipe(
      takeUntil(this.destroy$),
    );

    combineLatest([
      templateCatalog$.pipe(take(1)),
      i18nState$.pipe(take(1)),
      filters$.pipe(take(1)),
    ]).subscribe(([catalog]) => {
      this.setupFilterGroups(catalog);
      this.buildForm();
      this.watchForChanges();

      i18nState$.pipe(skip(1)).subscribe(() => this.setupFilterGroups(catalog));
      filters$.pipe(skip(1)).subscribe((filters) => this.patchForm(filters));
    });
  }

  ngAfterViewInit() {
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSubmit(event: Event) {
    event.preventDefault();
  }

  resetFilters() {
    this.proposalService.setFilters(
      ProposalsFiltersComponent.emptyFilterParams,
    );
  }

  isLabelTextMoreThanOneLine(label: string) {
    return label.length >= ONE_LINE_NODE_LABEL_LENGTH;
  }

  private setupFilterGroups(catalog: CatalogItem[]) {
    this.filterGroups = this.createFilters(catalog);
  }

  private createFilters(catalog: CatalogItem[]): ProposalFilterGroup[] {
    const catalogItemToOption =
      (group: keyof typeof groups) =>
      (item: CatalogItem): FilterOption => ({
        id: `${group}-${item.key}`,
        fieldName: `${group}-${item.key}`,
        label: this.proposalService.getTranslation(item.names),
        value: `${group}-${item.key}`,
        checked: false,
      });
    const roleToOption = (role: Role): FilterOption => ({
      id: `roles-${role}`,
      fieldName: `roles-${role}`,
      label: this.translateService.instant(
        `page.workspace.filter.filters.roles.${role.toLowerCase()}`,
      ),
      value: `roles-${role}`,
      checked: false,
    });
    const groups = this.groupFilterCatalogItems(catalog);
    return [
      {
        title: this.translateService.instant(
          'page.workspace.filter.procedures',
        ),
        filterOptions: groups.procedures.map(catalogItemToOption('procedures')),
      },
      {
        title: this.translateService.instant('page.workspace.filter.acts'),
        filterOptions: groups.acts.map(catalogItemToOption('acts')),
      },
      {
        title: this.translateService.instant('page.workspace.filter.templates'),
        filterOptions: groups.templates.map(catalogItemToOption('templates')),
      },
      {
        title: this.translateService.instant('page.workspace.filter.roles'),
        filterOptions: [
          'OWNER',
          'CONTRIBUTOR',
          'REVIEWER',
          'SUPPORT',
          'ADMIN',
          'USER',
        ].map(roleToOption),
      },
    ];
  }

  private groupFilterCatalogItems(catalog: CatalogItem[]) {
    const { proceduresDepth, actsDepth, templatesDepth } =
      this.getCatalogItemTypeDepths(catalog) ?? {};
    const groups = {
      procedures: [] as CatalogItem[],
      acts: [] as CatalogItem[],
      templates: [] as CatalogItem[],
    };

    if (!templatesDepth) {
      return groups;
    }

    const addCatalogItemToGroups = (item: CatalogItem, depth = 0) => {
      // i am commenting out this line of code since it seems that hidden isn't used for the groupping of the filters
      // instead for the filtering of the selection in the template tree
      // TODO : Confirm the remove of this code
      // if (item.hidden) {
      //   return;
      // }

      if (depth === proceduresDepth) {
        groups.procedures.push(item);
      } else if (depth === actsDepth) {
        groups.acts.push(item);
      } else if (depth === templatesDepth) {
        groups.templates.push(item);
      }

      if (item.type === 'CATEGORY' && item.enabled) {
        item.items.forEach((child) => addCatalogItemToGroups(child, depth + 1));
      }
    };

    catalog.forEach((item) => addCatalogItemToGroups(item));

    return groups;
  }

  private getCatalogItemTypeDepths(catalog: CatalogItem[]) {
    let templatesDepth: number;
    const findTemplateDepth = (item: CatalogItem, depth = 0) => {
      if (item.type === 'TEMPLATE') {
        templatesDepth = depth;
        return true;
      }
      return item.items.some((child) => findTemplateDepth(child, depth + 1));
    };
    catalog.some(findTemplateDepth);

    if (templatesDepth === undefined) {
      return;
    }
    return {
      proceduresDepth: templatesDepth - 2,
      actsDepth: templatesDepth - 1,
      templatesDepth,
    };
  }

  private buildForm() {
    if (!this.form) {
      this.form = this.fb.group({});
    }
    // FIXME: remove old controls, while maintaining state
    this.form.addControl('searchTerm', new FormControl(''));
    this.filterGroups
      .flatMap((group) => group.filterOptions)
      .forEach((opt) => {
        this.form.addControl(opt.fieldName, new FormControl(opt.checked));
      });
  }

  private watchForChanges() {
    this.formChangesSub?.unsubscribe();
    this.formChangesSub = this.form.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => {
        const filters = this.constructFiltersFromForm();
        this.proposalService.setFilters(filters);
      });
  }

  private constructFiltersFromForm(): ProposalFilter {
    const formValue = this.form.value;
    const checkedFormControlNames = Object.keys(formValue).filter(
      (name) => formValue[name] === true,
    );
    const filterOptions = this.filterGroups.flatMap((f) => f.filterOptions);

    const filters = checkedFormControlNames
      .map((name) => filterOptions.find((opt) => opt.fieldName === name))
      .filter(Boolean)
      .reduce((fs, filterOption) => {
        const [_, filterKey, filterVal] =
          filterOption.value.match(/^([^-]+)-(.*)/);
        switch (filterKey) {
          case 'procedures':
            fs.procedures.push(filterVal as ProcedureType);
            break;
          case 'acts':
            fs.acts.push(filterVal);
            break;
          case 'templates':
            fs.templates.push(filterVal);
            break;
          case 'roles':
            fs.roles.push(filterVal as Role);
            break;
          default:
            break;
        }
        return fs;
      }, ProposalsFiltersComponent.emptyFilterParams);
    filters.searchTerm = formValue.searchTerm as string;

    return filters;
  }

  private patchForm(filters: Partial<ProposalFilter>) {
    const patch = {} as any;

    if (filters.searchTerm !== undefined) {
      patch.searchTerm = filters.searchTerm;
    }

    const updateGroup = (group: string) => {
      const controlNamesChecked = filters[group].map(
        (key) => `${group}-${key}`,
      );
      Object.keys(this.form.value)
        .filter((name) => name.startsWith(`${group}-`))
        .forEach((name) => (patch[name] = controlNamesChecked.includes(name)));
    };
    const groupsToUpdate = Object.keys(filters).filter((key) =>
      Array.isArray(filters[key]),
    );
    groupsToUpdate.forEach(updateGroup);

    this.form.patchValue(patch, { emitEvent: false });
  }

  private setupResizeObserver() {
    const widthBS = new BehaviorSubject<number>(0);
    this.resizeObserver = new ResizeObserver((entries) => {
      widthBS.next(entries[0].contentRect.width);
    });

    widthBS
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.updateOptionTooltips());
    this.resizeObserver.observe(this.filtersContainer.nativeElement);
  }

  private updateOptionTooltips() {
    this.filterGroups
      .flatMap((group) => group.filterOptions)
      .forEach((option) => this.setOptionTooltip(option));
  }

  private setOptionTooltip(option: FilterOption) {
    const labelEl = this.filtersContainer.nativeElement.querySelector(
      `#${option.id} + label`,
    ) as HTMLElement;
    const isLabelTextTruncated =
      labelEl && labelEl.offsetWidth < labelEl.scrollWidth;
    option.tooltip = isLabelTextTruncated
      ? this.truncateLabelText(option.label)
      : '';
  }

  private truncateLabelText(label: string): string {
    if (label.length > MAX_TRUNCATION_LIMIT) {
      return label.substring(0, MAX_TRUNCATION_LIMIT) + '…';
    }
    return label;
  }
}
