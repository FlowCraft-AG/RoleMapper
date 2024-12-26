'use client';

import CorporateFareTwoToneIcon from '@mui/icons-material/CorporateFareTwoTone';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { Alert, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { JSXElementConstructor, useCallback, useEffect, useState } from 'react';
import { fetchOrgUnits } from '../../app/organisationseinheiten/fetchkp';
import theme from '../../theme';
import { OrgUnit, OrgUnitDTO } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';
import CustomTreeItem from '../customs/CustomTreeItem';
import TransitionComponent from './TransitionComponent';

interface OrgUnitRichTreeViewProps {
  onSelect: (orgUnit: OrgUnitDTO) => void;
}

export default function OrgUnitsSpalte({ onSelect }: OrgUnitRichTreeViewProps) {
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Funktion zum Abrufen der Organisationseinheiten
  const loadOrgUnits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchOrgUnits(); // Serverseitige Funktion aufrufen
      setOrgUnits(data);
    } catch (err) {
      setError('Fehler beim Laden der Daten.');
    } finally {
      setLoading(false);
    }
  }, []); // Die Funktion wird nur beim ersten Laden ausgeführt

  const refetch = (orgUnitList: OrgUnit[]) => {
    console.log('Refetching OrgUnits');
    setOrgUnits(orgUnitList);
  };

  useEffect(() => {
    loadOrgUnits();
  }, [loadOrgUnits]); // Der Effekt wird nur beim ersten Laden der Komponente ausgeführt.

  // Ladeanzeige während des Abfragens
  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );

  // Fehlerbehandlung
  if (error)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Fehler: {error}</Alert>
      </Box>
    );

  // Prüfe, ob die Organisationseinheit ein Root-Knoten ist (z. B. IWI, EI, WW)
  const isRootOrgUnit = (orgUnit: OrgUnit) =>
    orgUnit?.alias || orgUnit?.kostenstelleNr;
  const orgUnitList: OrgUnit[] = orgUnits;
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
          item: CustomTreeItem as unknown as JSXElementConstructor<TreeItemProps>,
        }}
        slotProps={{
          item: {
            refetch, // Weitergabe der Refetch-Methode an CustomTreeItem
            slots: { groupTransition: TransitionComponent },
          } as ExtendedSlotProps, // Erweiterter Typ
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

interface ExtendedSlotProps extends TreeItem2Props {
  refetch: () => Promise<void>; // Die refetch-Methode
}
