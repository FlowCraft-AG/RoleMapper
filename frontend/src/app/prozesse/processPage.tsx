/**
 * @file ProcessPage.tsx
 * @description Stellt die Prozess-Seite der Hochschule Karlsruhe (HKA) dar. Diese Seite erlaubt es,
 * Prozesse hierarchisch zu durchsuchen und auszuwählen.
 *
 * @module ProcessPage
 */

'use client';

import { Box, Button, Typography, useTheme } from '@mui/material';
import { use, useCallback, useEffect, useState } from 'react';
import CreateProcessCollectionModal from '../../components/modal/processModals/CreateProcessCollectionModal';
import ProcessSpalte from '../../components/prozess/ProcessSpalte';
import RolesSpalte from '../../components/prozess/RolesSpalte';
import { fetchAllProcesses } from '../../lib/api/rolemapper/process.api';
import { Process } from '../../types/process.type';

export default function ProcessPage() {
  const theme = useTheme();
  const [state, setState] = useState({
    selectedProcess: undefined as Process | undefined,
    expandedNodes: [] as string[],
  });
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [processList, setProcessList] = useState<Process[]>([]);

  const handleProcessSelect = (process: Process) => {
    setState({
      ...state,
      selectedProcess: process,
      expandedNodes: [],
    });
  };

  const handleAddProcessCollection = () => {
    setOpenCreateModal(true);
  };

  /**
   * Lädt alle Prozesse vom Server.
   */
  const refetchProcesses = useCallback(async () => {
    try {
      const updatedProcesses = await fetchAllProcesses();
      setProcessList(updatedProcesses);
    } catch (error) {
      console.error('Fehler beim Laden der Prozesse:', error);
    }
  }, []);

    useEffect(() => {
        refetchProcesses();
    }, [refetchProcesses]);

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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Verteilt Titel und Button
            marginBottom: 2,
            borderBottom: `2px solid`,
            borderImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}) 1`,
            borderImageSlice: 1,
            paddingRight: 2,
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
              flexGrow: 1, // Nimmt den verfügbaren Platz, um den Button nach rechts zu schieben
            }}
          >
            Prozesse
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddProcessCollection}
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Neue Prozess unter Neuer Collection
          </Button>
        </Box>
        <ProcessSpalte onSelect={handleProcessSelect} />
        {/* Bereich für zusätzliche Details */}
      </Box>
      {state.selectedProcess && state.selectedProcess.parentId && (
        <RolesSpalte selectedProcess={state.selectedProcess} />
      )}

      <CreateProcessCollectionModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        refetch={refetchProcesses} // Aktualisierung der Prozesse nach dem Erstellen
      />
    </Box>
  );
}
