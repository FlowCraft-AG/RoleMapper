'use client';

import CorporateFareTwoToneIcon from '@mui/icons-material/CorporateFareTwoTone';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { Alert, CircularProgress, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { JSXElementConstructor, useCallback, useEffect, useState } from 'react';
import { fetchOrgUnits } from '../../app/organisationseinheiten/fetchkp';
import { FacultyTheme } from '../../interfaces/facultyTheme';
import getFacultyTheme from '../../theme/fakultäten';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';
import { OrgUnit, OrgUnitDTO } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';
import CustomTreeItem from '../customs/CustomTreeItem';
import TransitionComponent from './TransitionComponent';

interface OrgUnitRichTreeViewProps {
  onSelect: (orgUnit: OrgUnitDTO) => void;
}

export default function OrgUnitsSpalte({ onSelect }: OrgUnitRichTreeViewProps) {
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ein unbekannter Fehler ist aufgetreten.');
      }
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

  // Funktion, um alle Kinder und Enkelkinder einer OrgUnit zu finden
  const getOrgUnitHierarchy = (
    orgUnits: OrgUnit[],
    parentId: string | null,
  ) => {
    // Finde alle OrgUnits, deren parentId mit der aktuellen parentId übereinstimmt
    const children = orgUnits.filter((unit) => unit.parentId === parentId);

    // Rekursiver Aufruf für jedes Kind, um deren Kinder und Enkelkinder zu finden
    children.forEach((child) => {
      child.children = getOrgUnitHierarchy(orgUnits, child._id); // Füge Kinder zu jedem Kind hinzu
    });

    console.log('children', children);

    return children;
  };

  const handleItemClick = (event: React.MouseEvent, nodeId: string) => {
    const selectedOrgUnit = orgUnits.find((unit) => unit._id === nodeId);

    if (!selectedOrgUnit) {
      console.error(`Organisationseinheit mit ID ${nodeId} nicht gefunden.`);
      return;
    }

    // Dynamische Farbänderung basierend auf Fakultät
    const newTheme = getFacultyTheme(selectedOrgUnit.name);

    // Funktion, um das Theme rekursiv auf alle Knoten anzuwenden
    const applyThemeToOrgUnit = (unit: OrgUnit, theme: FacultyTheme) => {
      setFacultyTheme(theme); // Setze das Theme für das aktuelle Element

      // Rekursiv auf alle Kinder und Enkelkinder anwenden
      unit.children?.forEach((child) => applyThemeToOrgUnit(child, theme));
    };

    // Finde alle Kinder und Enkelkinder der ausgewählten Organisationseinheit
    const orgUnitHierarchy = getOrgUnitHierarchy(orgUnits, selectedOrgUnit._id);
    console.log('orgUnitHierarchy', orgUnitHierarchy);

    // Das Theme für die gesamte Hierarchie anwenden
    orgUnitHierarchy.forEach((unit) => applyThemeToOrgUnit(unit, newTheme));

    // Weitergabe der Auswahl an die Parent-Komponente
    onSelect({
      id: selectedOrgUnit._id,
      alias: selectedOrgUnit.alias || '',
      kostenstelleNr: selectedOrgUnit.kostenstelleNr || '',
      name: selectedOrgUnit.name,
      type: selectedOrgUnit.type,
    });
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
