import { Function } from './function.type';

export type OrgUnit = {
  _id: string;
  name: string;
  parentId: string | null;
  supervisor: string | null;
  alias: string | null;
  kostenstelleNr: string | null;
  type: string | null;
  children?: OrgUnit[];
};

export type OrgUnitDTO = {
  id: string;
  name?: string;
  parentId?: string | null;
  supervisor?: string | null;
  alias?: string | null;
  kostenstelleNr?: string | null;
  type?: string | null;
  hasMitglieder?: boolean;
};

export type OrgUnitInfo = {
  _id: string;
  name: string;
  parentId: string | undefined;
};

export type OrgUnitListProps = {
  orgUnits: OrgUnit[];
  functionsByOrgUnit: Record<string, Function[]>;
  expandedOrgUnits: Record<string, boolean>;
  toggleExpandOrgUnit: (id: string) => void;
  toggleCircle: (mandate: Function) => void;
  filledCircles: Set<string>;
};
