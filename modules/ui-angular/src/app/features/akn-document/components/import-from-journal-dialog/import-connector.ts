import {
  ElementName,
  ImportConnectorState,
} from '@/features/akn-document/models/import.model';
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type ImportConnectorOptions = {
  parentElement: Element;
  handleSelectionChange: (count: number) => void;
  receiveSelectedElements: (elementIds: string[]) => void;
};

export class ImportConnector extends AbstractJavaScriptComponent<ImportConnectorState> {
  /* set in `modules/js/src/main/js/ui/extension/importElementExtension.js` */
  requestSelectedElements?: () => void;
  selectAllElements?: (value: boolean, elementName: ElementName) => void;
  selectAllEnactingItems?: (value: boolean) => void;

  constructor(private options: ImportConnectorOptions) {
    super({ ...leosJavaScriptExtensionState }, null);
  }

  handleSelectionChange(obj: { count: number }) {
    this.options.handleSelectionChange(obj.count);
  }

  receiveSelectedElements(obj: { elementIds: string[] }) {
    this.options.receiveSelectedElements(obj.elementIds);
  }

  getElement() {
    return this.options.parentElement;
  }
}

const leosJavaScriptExtensionState: LeosJavaScriptExtensionState = {
  callbackNames: ['handleSelectionChange', 'receiveSelectedElements'],
  rpcInterfaces: {
    'eu.europa.ec.leos.ui.shared.js.LeosJavaScriptServerRpc': [
      'clientJSDepsInited',
    ],
  },
  jsDepsInited: true,
  dirtyTimestamp: -1,
};
