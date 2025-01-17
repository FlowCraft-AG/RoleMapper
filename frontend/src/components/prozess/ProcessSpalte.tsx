/**
 * @file ProcessSpalte.tsx
 * @description Stellt die Spalte für Prozesse dar. Die Prozesse werden in einer Baumstruktur dargestellt,
 * und es können Interaktionen mit den Prozessen durchgeführt werden.
 *
 * @module ProcessSpalte
 */

'use client';

import DescriptionIcon from '@mui/icons-material/Description';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { Alert, CircularProgress, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { JSXElementConstructor, useCallback, useEffect, useState } from 'react';
import { fetchAllProcesses } from '../../lib/api/rolemapper/process.api';
import { Process } from '../../types/process.type';
import { getListItemStyles } from '../../utils/styles';
import { CustomProcessTreeItem } from '../customs/CustomProcessTreeItem';
import TransitionComponent from '../organigramm/TransitionComponent';

/**
 * Erweiterte Slot-Props für die TreeItem-Komponente.
 *
 * @interface ExtendedSlotProps
 * @extends TreeItem2Props
 * @property {function} refetch - Methode zum Neuladen der Daten.
 */
interface ExtendedSlotProps extends TreeItem2Props {
  refetch: () => Promise<void>; // Die refetch-Methode
  onRemove: () => void;
}

/**
 * Props für die `ProcessSpalte`-Komponente.
 *
 * @interface ProcessRichTreeViewProps
 * @property {function} onSelect - Callback-Funktion, die aufgerufen wird, wenn ein Prozess ausgewählt wird.
 * @property {string[] | undefined} expandedNodes - Die Knoten, die standardmäßig geöffnet sind.
 */
interface ProcessRichTreeViewProps {
  onSelect: (process: Process) => void;
}

/**
 * Die `ProcessSpalte`-Komponente stellt die Prozesse in einer hierarchischen Struktur dar.
 *
 * - Verwendet eine rekursive Struktur, um Prozesse und deren Unterprozesse darzustellen.
 * - Ermöglicht das dynamische Laden und Aktualisieren von Prozessen.
 *
 * @component
 * @param {ProcessRichTreeViewProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Prozess-Spalte.
 *
 * @example
 * <ProcessSpalte
 *   onSelect={(process) => console.log(process)}
 *   expandedNodes={['node1', 'node2']}
 * />
 */
export default function ProcessSpalte({ onSelect }: ProcessRichTreeViewProps) {
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  /**
   * Lädt alle Prozesse vom Server.
   *
   * @async
   * @function loadProcesses
   * @returns {Promise<void>}
   */
  const loadProcesses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllProcesses();
      setProcesses(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unbekannter Fehler.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Die Funktion wird nur beim ersten Laden ausgeführt

  const onRemove = () => {
    loadProcesses();
  };

  useEffect(() => {
    loadProcesses();
  }, [loadProcesses]); // Der Effekt wird nur beim ersten Laden der Komponente ausgeführt.

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
  const treeData = buildTree(processes, null);

  /**
   * Erstellt eine rekursive Baumstruktur aus den Prozessen.
   *
   * @function buildTree
   * @param {Process[]} data - Die Prozess-Daten.
   * @param {string | null} parentId - Die ID des übergeordneten Prozesses.
   * @returns {TreeViewBaseItem[]} Die Baumstruktur.
   */
  function buildTree(
    data: Process[],
    parentId: string | null,
  ): TreeViewBaseItem[] {
    return data
      .filter((process) => process.parentId === parentId)
      .map((process) => ({
        id: process._id,
        label: process.name,
        children: buildTree(data, process._id),
      }));
  }

  /**
   * Behandelt Klicks auf Elemente im TreeView.
   *
   * @function handleItemClick
   * @param {React.MouseEvent} event - Das Klick-Event.
   * @param {string} nodeId - Die ID des angeklickten Knotens.
   */
  const handleItemClick = (event: React.MouseEvent, nodeId: string) => {
    const selectedProcess = processes.find((process) => process._id === nodeId);
    if (!selectedProcess)
      return console.error(`Prozess mit ID ${nodeId} nicht gefunden.`);

    // Weitergabe der Auswahl an die Parent-Komponente
    onSelect(selectedProcess);
  };

  const refetch = () => {
    setProcesses(processes);
    onRemove();
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        items={treeData}
        slots={{
          expandIcon: FolderOpenIcon,
          collapseIcon: FolderRoundedIcon,
          endIcon: DescriptionIcon,
          item: CustomProcessTreeItem as unknown as JSXElementConstructor<TreeItemProps>,
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
            ...getListItemStyles(theme, true), // Stile für ausgewählte Elemente
          },
        }}
      />
    </Box>
  );
}
