'use client';

import { useQuery } from '@apollo/client';
import CorporateFareTwoToneIcon from '@mui/icons-material/CorporateFareTwoTone';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useState } from 'react';
import { ORG_UNITS } from '../../graphql/queries/get-orgUnits';
import client from '../../lib/apolloClient';
import theme from '../../theme';
import { OrgUnit, OrgUnitDTO } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';
import CustomTreeItem from './CustomTreeItem';
import TransitionComponent from './TransitionComponent';

interface OrgUnitRichTreeViewProps {
  onSelect: (orgUnit: OrgUnitDTO) => void;
}

export default function OrgUnitsSpalte({ onSelect }: OrgUnitRichTreeViewProps) {
  const [expanded, setExpanded] = useState<string[]>([]); // Geöffnete Knoten

  const { data, loading, error, refetch } = useQuery(ORG_UNITS, {
    client,
  });

  if (loading) return <div>Lade Organisationseinheiten...</div>;
  if (error) return <div>Fehler beim Laden der Daten.</div>;

  // Prüfe, ob die Organisationseinheit ein Root-Knoten ist (z. B. IWI, EI, WW)
  const isRootOrgUnit = (orgUnit: OrgUnit) =>
    orgUnit?.alias || orgUnit?.kostenstelleNr;
  const orgUnitList: OrgUnit[] = data.getData.data;
  const treeData = buildTree(orgUnitList, null);

  // Baue die Tree-Datenstruktur
  function buildTree(
    data: OrgUnit[],
    parentId: string | null,
  ): TreeViewBaseItem[] {
    return data
      .filter((unit) => unit.parentId === parentId)
      .map((unit) => ({
        id: unit._id,
        label: unit.name,
        children: buildTree(data, unit._id),
      }));
  }

  const handleItemClick = (event: React.MouseEvent, nodeId: string) => {
    const selectedOrgUnit = orgUnitList.find((unit) => unit._id === nodeId);

    if (selectedOrgUnit) {
      if (isRootOrgUnit(selectedOrgUnit)) {
        onSelect({
          id: selectedOrgUnit._id,
          alias: selectedOrgUnit.alias || '',
          kostenstelleNr: selectedOrgUnit.kostenstelleNr || '',
          name: selectedOrgUnit.name,
          type: selectedOrgUnit.type,
        });
      } else {
        onSelect({
          id: selectedOrgUnit._id,
          name: selectedOrgUnit.name,
          parentId: selectedOrgUnit.parentId,
        });
      }
    }
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        items={treeData}
        slots={{
          expandIcon: FolderOpenIcon,
          collapseIcon: FolderRoundedIcon,
          endIcon: CorporateFareTwoToneIcon,
          item: CustomTreeItem, // Refetch wird hier übergeben
        }}
        slotProps={{
          item: {
            refetch,
            slots: { groupTransition: TransitionComponent },
          },
        }}
        onItemClick={handleItemClick}
        sx={{
          '& .MuiTreeItem-content': {
            ...getListItemStyles(theme, false), // Standardstile
          },
          '& .Mui-selected, & .Mui-selected-parents': {
            ...getListItemStyles(theme, true), // Ausgewähltes Element
          },
        }}
      />
    </Box>
  );
}
