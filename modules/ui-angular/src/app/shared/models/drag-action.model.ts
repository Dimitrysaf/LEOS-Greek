export type DROP_ACTION = 'BEFORE' | 'AFTER' | 'AS_CHILDREN';

export interface DragAction {
  targetId: string;
  action: DROP_ACTION;
  level: number;
  isAdd: boolean;
  isSameNode?: boolean;
}
