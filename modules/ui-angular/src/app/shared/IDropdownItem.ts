export interface IDropdownItem {
  id?: string;
  label?: string;
  icon?: string;
  children?: IDropdownItem[];
  disabled?: boolean;
  url?: string;
  urlExternal?: string;
  urlExternalTarget?: string;
  command?: () => void;
  iconLabel?: string;
}
