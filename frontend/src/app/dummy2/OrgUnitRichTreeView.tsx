'use client';

import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { FUNCTIONS } from '../../graphql/queries/get-functions';
import { ORG_UNITS } from '../../graphql/queries/get-orgUnits';
import client from '../../lib/apolloClient';

export type OrgUnit = {
  _id: string;
  name: string;
  parentId: string | null;
  supervisor: string | null;
};

export type Function = {
  _id: string;
  functionName: string;
  users: string[];
  orgUnit: string;
};

interface OrgUnitRichTreeViewProps {
  onSelect: (id: string | null, hasFunctions: boolean) => void;
}

export default function OrgUnitRichTreeView({
  onSelect,
}: OrgUnitRichTreeViewProps) {
  const {
    loading: loadingOrgUnits,
    error: errorOrgUnits,
    data: dataOrgUnits,
  } = useQuery(ORG_UNITS, { client });

  const {
    loading: loadingFunctions,
    error: errorFunctions,
    data: dataFunctions,
  } = useQuery(FUNCTIONS, { client });

  if (loadingOrgUnits || loadingFunctions)
    return <div>Lade Organisationseinheiten...</div>;
  if (errorOrgUnits || errorFunctions)
    return <div>Fehler beim Laden der Daten.</div>;

  function buildTree(
    data: OrgUnit[],
    parentId: string | null,
  ): TreeViewBaseItem[] {
    return data
      .filter((item) => item.parentId === parentId)
      .map((item) => {
        const hasFunctions = dataFunctions.getData.data.some(
          (func: Function) => func.orgUnit === item._id,
        );

        return {
          id: item._id,
          label: item.name,
          children: buildTree(data, item._id),
          hasFunctions,
        };
      });
  }

  const treeData: TreeViewBaseItem[] = buildTree(
    dataOrgUnits.getData.data,
    null,
  );

  const handleItemClick = (event: React.MouseEvent, nodeId: string) => {
    const hasFunctions = dataFunctions.getData.data.some(
      (func: Function) => func.orgUnit === nodeId,
    );
    onSelect(nodeId, hasFunctions);
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={treeData} onItemClick={handleItemClick} />
    </Box>
  );
}
