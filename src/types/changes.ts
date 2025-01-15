export type ChangeType = "space" | "reminder" | "shortcut" | "ambientSound";
export type ChangeAction = "update" | "delete" | "create";

export type Change = {
  id: string;
  timestamp: number;
  type: ChangeType;
  action: ChangeAction;
  spaceId?: number;
  property?: string;
  value: unknown;
};

export type Changes = {
  pending: Change[];
  failed: Change[];
};
