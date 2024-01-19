import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';

export enum IRibbonToolbarType {
  'BUTTON',
  'DROPDOWN',
  'CHECKBOX',
  'SECTION',
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
  iconClass?: string; // used for eui icons
  svgIconClas?: string;
  svgType?: SvgType;
  disabled?: boolean;
  actionFn?: (...args) => void; // callable action
  cssClasses?: string[]; // used for adding different styles to the item
  label?: string; //no need for every section to have a name
  description?: string; //used for a tooltip ?
  euiStyle?: TypeClass;
  euiSize?: SizeClass;
  resizeOrder?: number;
}

export interface IRibbonToolbarSection extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.SECTION;
  order: number;
  children: IRibbonToolbarItem[];
}

export interface IRibbonToolbarButton extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.BUTTON;
}

export interface IRibbonToolbarDropdown extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.DROPDOWN;
  items: EuiDropdownButtonMenuItem[];
}

export interface IRibbonToolbarCheckbox extends IBaseRibbonToolbarItem {
  type: IRibbonToolbarType.CHECKBOX;
  value?: boolean;
  isSlider?: boolean;
}

export type IRibbonToolbarItem =
  | IRibbonToolbarButton
  | IRibbonToolbarDropdown
  | IRibbonToolbarCheckbox
  | IRibbonToolbarSection;
