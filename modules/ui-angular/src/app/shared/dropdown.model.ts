export interface DropdownModel {
  id?: string;
  label?: string;
  icon?: string;
  children?: DropdownModel[];
  disabled?: boolean;
  url?: string;
  urlExternal?: string;
  urlExternalTarget?: string;
  command?: CallableFunction;
  iconLabel?: string;
}
