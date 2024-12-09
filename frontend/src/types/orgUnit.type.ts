export interface OrgUnit {
    _id: string;
    name: string;
    parentId: string | null;
    supervisor: string | null;
}
