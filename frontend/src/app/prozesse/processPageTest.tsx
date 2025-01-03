/**
 * @file ProcessPage.tsx
 * @description Stellt die Prozess-Seite der Hochschule Karlsruhe (HSKA) dar. Diese Seite erlaubt es,
 * Prozesse hierarchisch zu durchsuchen und auszuwählen.
 *
 * @module ProcessPage
 */

'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getProcessById } from '../../lib/api/process.api';
import { Process } from '../../types/process.type';
import ProcessSpalte from '../../components/prozess/ProcessSpalte';

/**
 * Hauptkomponente für die Prozess-Seite.
 *
 * Diese Komponente implementiert:
 * - Auswahl von Prozessen
 * - Dynamische Anzeige von Prozessen in einer Baumstruktur
 *
 * @component
 * @returns {JSX.Element} Die JSX-Struktur der Seite.
 *
 * @example
 * Verwendung in einer Next.js-App
 * <ProcessPage />
 */
export default function ProcessPage() {
  const theme = useTheme();
  const [state, setState] = useState({
    selectedProcess: undefined as Process | undefined,
    expandedNodes: [] as string[],
  });

  const searchParams = useSearchParams();
  const openNodesParam = searchParams.get('openNodes') || '';
  const parentProcessIdParam = searchParams.get('parentProcessId') || '';

  const resetUrlParams = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('openNodes');
    currentUrl.searchParams.delete('parentProcessId');
    window.history.replaceState(null, '', currentUrl.toString());
  };

  /**
   * Initialisiert die Seite basierend auf URL-Parametern.
   *
   * @function initializePageState
   * @async
   * @returns {Promise<void>}
   */
  const initializePageState = useCallback(async () => {
    try {
      const expandedNodes = openNodesParam.split(',').filter(Boolean);
      const selectedProcess = parentProcessIdParam
        ? await getProcessById(parentProcessIdParam)
        : undefined;

      setState((prev) => ({
        ...prev,
        expandedNodes,
        selectedProcess,
      }));
    } catch (error) {
      console.error('Fehler beim Initialisieren der Daten:', error);
    }
  }, [openNodesParam, parentProcessIdParam]);

  useEffect(() => {
    initializePageState();
  }, [initializePageState]);

  /**
   * Handhabt die Auswahl eines Prozesses.
   *
   * @function handleProcessSelect
   * @param {Process} process - Der ausgewählte Prozess.
   */
  const handleProcessSelect = (process: Process) => {
    setState({
      ...state,
      selectedProcess: process,
      expandedNodes: [],
    });
    resetUrlParams();
  };

  /**
   * Handhabt das Entfernen eines Prozesses.
   *
   * @function handleRemoveSelection
   * @param {string[]} ids - Die IDs der zu entfernenden Prozesse.
   */
  const handleRemoveSelection = (ids: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedProcess: ids.includes(prev.selectedProcess?._id || '')
        ? undefined
        : prev.selectedProcess,
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        padding: 2,
        backgroundColor: theme.palette.background.default,
        overflowX: 'auto',
      }}
    >
      {/* Spalte für die Prozesse */}
      <Box
        sx={{
          flexGrow: 1,
          flexShrink: 0,
          borderRight: `1px solid ${theme.palette.divider}`,
          padding: '0 2px 2px 2px',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 64px)',
          borderRadius: 4,
          boxShadow: `0px 4px 8px ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            position: 'sticky',
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
            padding: '12px 0',
            marginBottom: 2,
            borderBottom: `2px solid`,
            borderImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}) 1`,
            borderImageSlice: 1,
          }}
        >
          Prozesse
        </Typography>
        <ProcessSpalte
          onSelect={handleProcessSelect}
          onRemove={handleRemoveSelection}
          expandedNodes={state.expandedNodes}
        />
      </Box>

      {/* Bereich für zusätzliche Details */}
      {state.selectedProcess && (
        <Box
          sx={{
            flexGrow: 1,
            padding: 2,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: 4,
            boxShadow: `0px 4px 8px ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 2,
            }}
          >
            Details zu {state.selectedProcess.name}
          </Typography>
          {/* Zusätzliche Informationen zum Prozess können hier dargestellt werden */}
          <pre>{JSON.stringify(state.selectedProcess, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}
