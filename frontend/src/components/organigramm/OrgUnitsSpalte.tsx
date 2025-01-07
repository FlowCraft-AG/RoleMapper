/**
 * @file OrgUnitsSpalte.tsx
 * @description Stellt die Spalte für Organisationseinheiten dar. Die Organisationseinheiten werden in einer Baumstruktur dargestellt,
 * und es können dynamische Themes sowie Interaktionen mit den Einheiten durchgeführt werden.
 *
 * @module OrgUnitsSpalte
 */

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
import { FacultyTheme } from '../../interfaces/facultyTheme';
import { fetchAllOrgUnits } from '../../lib/api/orgUnit.api';
import getFacultyTheme from '../../theme/fakultäten';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';
import { OrgUnit } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';
import CustomTreeItem from '../customs/CustomTreeItem';
import TransitionComponent from './TransitionComponent';

/**
 * Erweiterte Slot-Props für die TreeItem-Komponente.
 *
 * @interface ExtendedSlotProps
 * @extends TreeItem2Props
 * @property {function} refetch - Methode zum Neuladen der Daten.
 * @property {function} onRemove - Callback-Funktion, um Elemente zu entfernen.
 */
interface ExtendedSlotProps extends TreeItem2Props {
  refetch: () => Promise<void>; // Die refetch-Methode
  onRemove: (ids: string[]) => void; // Übergibt ein Array von IDs
}

/**
 * Props für die `OrgUnitsSpalte`-Komponente.
 *
 * @interface OrgUnitRichTreeViewProps
 * @property {function} onSelect - Callback-Funktion, die aufgerufen wird, wenn eine Organisationseinheit ausgewählt wird.
 * @property {function} onRemove - Callback-Funktion, die aufgerufen wird, wenn Organisationseinheiten entfernt werden.
 * @property {string[] | undefined} expandedNodes - Die Knoten, die standardmäßig geöffnet sind.
 */
interface OrgUnitRichTreeViewProps {
  onSelect: (orgUnit: OrgUnit) => void;
  onRemove: (ids: string[]) => void; // Übergibt ein Array von IDs
  expandedNodes?: string[] | undefined;
}

/**
 * Die `OrgUnitsSpalte`-Komponente stellt die Organisationseinheiten in einer hierarchischen Struktur dar.
 *
 * - Unterstützt dynamisches Styling basierend auf der ausgewählten Fakultät.
 * - Verwendet eine rekursive Struktur, um Organisationseinheiten und deren Untereinheiten darzustellen.
 * - Ermöglicht das dynamische Laden und Aktualisieren von Organisationseinheiten.
 *
 * @component
 * @param {OrgUnitRichTreeViewProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Organisationseinheiten-Spalte.
 *
 * @example
 * <OrgUnitsSpalte
 *   onSelect={(orgUnit) => console.log(orgUnit)}
 *   onRemove={(ids) => console.log(ids)}
 *   expandedNodes={['node1', 'node2']}
 * />
 */
export default function OrgUnitsSpalte({
  onSelect,
  onRemove,
  expandedNodes,
}: OrgUnitRichTreeViewProps) {
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  /**
   * Lädt alle Organisationseinheiten vom Server.
   *
   * @async
   * @function loadOrgUnits
   * @returns {Promise<void>}
   */
  const loadOrgUnits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrgUnits();
      console.log('OrgUnitsSpalte - loadOrgUnits: orgUnits', data);
      setOrgUnits(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unbekannter Fehler.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Die Funktion wird nur beim ersten Laden ausgeführt

  /**
   * Aktualisiert die Organisationseinheiten in der Komponente.
   *
   * @function refetch
   * @param {OrgUnit[]} orgUnitList - Die aktualisierte Liste der Organisationseinheiten.
   */
  const refetch = (orgUnitList: OrgUnit[]) => {
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

  // Baumstruktur für TreeView vorbereiten
  const treeData = buildTree(orgUnits, null);

  /**
   * Erstellt eine rekursive Baumstruktur aus den Organisationseinheiten.
   *
   * @function buildTree
   * @param {OrgUnit[]} data - Die Organisationseinheiten-Daten.
   * @param {string | null} parentId - Die ID der übergeordneten Einheit.
   * @returns {TreeViewBaseItem[]} Die Baumstruktur.
   */
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
    parentId: string | undefined,
  ) => {
    // Finde alle OrgUnits, deren parentId mit der aktuellen parentId übereinstimmt
    const children = orgUnits.filter((unit) => unit.parentId === parentId);

    // Rekursiver Aufruf für jedes Kind, um deren Kinder und Enkelkinder zu finden
    children.forEach((child) => {
      child.children = getOrgUnitHierarchy(orgUnits, child._id); // Füge Kinder zu jedem Kind hinzu
    });

    return children;
  };

  /**
   * Überprüft, ob eine Organisationseinheit Kinder hat.
   *
   * @function hasChildren
   * @param {OrgUnit[]} orgUnits - Die Liste der Organisationseinheiten.
   * @param {string} unitId - Die ID der Organisationseinheit.
   * @returns {boolean} `true`, wenn Kinder vorhanden sind, andernfalls `false`.
   */
  const hasChildren = (orgUnits: OrgUnit[], unitId: string): boolean => {
    return orgUnits.some((unit) => unit.parentId === unitId);
  };

  /**
   * Behandelt Klicks auf Elemente im TreeView.
   *
   * @function handleItemClick
   * @param {React.MouseEvent} event - Das Klick-Event.
   * @param {string} nodeId - Die ID des angeklickten Knotens.
   */
  const handleItemClick = (event: React.MouseEvent, nodeId: string) => {
    const selectedOrgUnit = orgUnits.find((unit) => unit._id === nodeId);
    if (!selectedOrgUnit)
      return console.error(`Unit mit ID ${nodeId} nicht gefunden.`);

    // Finde den Fakultäts-Parent
    const facultyParent = findFacultyParent(selectedOrgUnit);
    if (!facultyParent)
      return console.error(
        `Keine Fakultät für ${selectedOrgUnit.name} gefunden.`,
      );

    // Dynamische Farbänderung basierend auf Fakultät
    const newTheme = getFacultyTheme(facultyParent.name);

    if (hasChildren(orgUnits, selectedOrgUnit._id)) {
      // Finde alle Kinder und Enkelkinder der ausgewählten Organisationseinheit
      const orgUnitHierarchy = getOrgUnitHierarchy(
        orgUnits,
        selectedOrgUnit._id,
      );

      // Das Theme für die gesamte Hierarchie anwenden
      orgUnitHierarchy.forEach((unit) => applyThemeToOrgUnit(unit, newTheme));
    } else {
      // Das Theme nur für die ausgewählte Organisationseinheit anwenden
      applyThemeToOrgUnit(selectedOrgUnit, newTheme);
    }

    // Weitergabe der Auswahl an die Parent-Komponente
    onSelect(selectedOrgUnit);
  };
  /**
   * Wendet ein Theme auf eine Organisationseinheit und deren Kinder an.
   *
   * @function applyThemeToOrgUnit
   * @param {OrgUnit} unit - Die Organisationseinheit.
   * @param {FacultyTheme} theme - Das anzuwendende Theme.
   */
  const applyThemeToOrgUnit = (unit: OrgUnit, theme: FacultyTheme) => {
    setFacultyTheme(theme); // Setze das Theme für das aktuelle Element

    // Rekursiv auf alle Kinder und Enkelkinder anwenden
    unit.children?.forEach((child) => applyThemeToOrgUnit(child, theme));
  };

  /**
   * Findet die Fakultät für eine gegebene Organisationseinheit.
   *
   * @function findFacultyParent
   * @param {OrgUnit} unit - Die Organisationseinheit.
   * @returns {OrgUnit | undefined} Die übergeordnete Fakultät.
   */
  const findFacultyParent = (unit: OrgUnit): OrgUnit | undefined => {
    // Wenn die aktuelle Einheit keine übergeordnete Einheit hat, ist sie selbst eine Fakultät
    if (!unit.parentId) return unit;

    // Finde die übergeordnete Einheit
    const parent = orgUnits.find((u) => u._id === unit.parentId);

    if (!parent) {
      return undefined;
    }

    // Prüfe, ob der Parent "Fakultät" heißt
    // Rekursiv nach oben gehen bis zur Wurzel-Fakultät
    return parent?.name === 'Fakultät' ? unit : findFacultyParent(parent);
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        items={treeData}
        {...(expandedNodes &&
          expandedNodes.length > 0 && {
            expandedItems: expandedNodes, // Die offenen Knoten aus den Props
          })}
        {...(expandedNodes &&
          expandedNodes.length > 0 && {
            selectedItems: expandedNodes[expandedNodes.length - 1], // Der letzte offene Knoten
          })}
        slots={{
          expandIcon: FolderOpenIcon,
          collapseIcon: FolderRoundedIcon,
          endIcon: CorporateFareTwoToneIcon,
          item: CustomTreeItem as unknown as JSXElementConstructor<TreeItemProps>,
        }}
        slotProps={{
          item: {
            onRemove,
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
