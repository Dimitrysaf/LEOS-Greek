import { DropdownModel } from '@/shared/dropdown.model';
import { Observable } from 'rxjs';

export enum IRibbonToolbarType {
  'BUTTON',
  'DROPDOWN',
  'CHECKBOX',
  'SECTION',
  'GROUP',
  'LABEL',
}

export type TypeClass =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent';

export type SizeClass =
  | 'xs'
  | 's'
  | 'm'
  | 'l'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

export type SvgType = 'outline' | 'sharp' | 'default';

export interface IBaseRibbonToolbarItem {
  id: string;
  icon?: string; // used for eui icons
  svgIconClas?: string;
  svgType?: SvgType;
  disabled?: boolean | Observable<boolean> ;
  actionFn?: (...args) => void; // callable action
  cssClasses?: string; // used for adding different styles to the item
  label?: Observable<string> | string; //no need for every section to have a name
  description?: string; //used for a tooltip ?
  euiStyle?: TypeClass;
  euiSize?: SizeClass;
}

export interface IRibbonToolbarLabel extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.LABEL;
  truncatedLabel?: string;
}

export interface IRibbonToolbarSection extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.SECTION;
  order: number;
  resizeOrder: number;
  children: IRibbonToolbarItem[];
  closable?: boolean;
  closeFn?: (...args) => void;
  closableBtnStyle?: TypeClass;
  sectionContainerCssClasses?: string;
}

export interface IRibbonToolbarGroup extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.GROUP;
  children: IRibbonToolbarItem[];
}

export interface IRibbonToolbarButton extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.BUTTON;
  basicButton?: boolean;
}

export interface IRibbonToolbarDropdown extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.DROPDOWN;
  items: DropdownModel[];
}

export interface IRibbonToolbarCheckbox extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.CHECKBOX;
  value?: boolean | Observable<boolean>;
  isSlider?: boolean;
}

export type IRibbonToolbarItem =
  | IRibbonToolbarButton
  | IRibbonToolbarDropdown
  | IRibbonToolbarCheckbox
  | IRibbonToolbarSection
  | IRibbonToolbarGroup
  | IRibbonToolbarLabel;
