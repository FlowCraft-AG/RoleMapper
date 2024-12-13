'use client';

import { useLazyQuery, useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { FUNCTIONS } from '../../graphql/queries/get-functions';
import { ORG_UNITS } from '../../graphql/queries/get-orgUnits';
import { MITGLIEDER } from '../../graphql/queries/get-users';
import client from '../../lib/apolloClient';
import { Function } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { User } from './UserInfoColumn';

interface OrgUnitRichTreeViewProps {
  onSelect: (
    id: string,
    hasFunctions: boolean,
    mitglieder: User[],
    totalMitglieder: number,
    name: string,
    type: string,
  ) => void;
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

  const [fetchMitglieder, { data: dataMitglieder }] = useLazyQuery(MITGLIEDER, {
    client,
  });

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

  const handleItemClick = async (event: React.MouseEvent, nodeId: string) => {
    const orgUnit = dataOrgUnits.getData.data.find(
      (unit: OrgUnit) => unit._id === nodeId,
    );

    const hasFunctions = dataFunctions.getData.data.some(
      (func: Function) => func.orgUnit === nodeId,
    );

    let mitglieder = [];
    let totalMitglieder = 0;

    if (orgUnit?.alias || orgUnit?.kostenstelleNr) {
      const { data } = await fetchMitglieder({
        variables: {
          alias: orgUnit.alias || null,
          kostenstelleNr: orgUnit.kostenstelleNr || null,
        },
      });
      mitglieder = data?.getData.data;
      totalMitglieder = data?.getData.totalCount;
    }
    onSelect(
      nodeId,
      hasFunctions,
      mitglieder,
      totalMitglieder,
      orgUnit?.name,
      orgUnit?.type,
    );
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={treeData} onItemClick={handleItemClick} />
    </Box>
  );
}
