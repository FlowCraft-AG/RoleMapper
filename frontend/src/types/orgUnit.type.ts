import { Function } from "./function.type";

export type OrgUnit = {
    _id: string;
    name: string;
    parentId: string | null;
    supervisor: string | null;
};

export type OrgUnitListProps = {
    orgUnits: OrgUnit[];
    functionsByOrgUnit: Record<string, Function[]>;
    expandedOrgUnits: Record<string, boolean>;
    toggleExpandOrgUnit: (id: string) => void;
    toggleCircle: (functionId: string) => void;
    filledCircles: Set<string>;
};
