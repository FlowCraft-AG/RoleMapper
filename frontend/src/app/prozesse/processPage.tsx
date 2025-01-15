/**
 * @file ProcessPage.tsx
 * @description Stellt die Prozess-Seite der Hochschule Karlsruhe (HKA) dar. Diese Seite erlaubt es,
 * Prozesse hierarchisch zu durchsuchen und auszuwählen.
 *
 * @module ProcessPage
 */

'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import ProcessSpalte from '../../components/prozess/ProcessSpalte';
import RolesSpalte from '../../components/prozess/RolesSpalte2';
import { Process } from '../../types/process.type';

export default function ProcessPage() {
  const theme = useTheme();
  const [state, setState] = useState({
    selectedProcess: undefined as Process | undefined,
    expandedNodes: [] as string[],
  });

  const handleProcessSelect = (process: Process) => {
    setState({
      ...state,
      selectedProcess: process,
      expandedNodes: [],
    });
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
        <ProcessSpalte onSelect={handleProcessSelect} />
        {/* Bereich für zusätzliche Details */}
      </Box>
      {state.selectedProcess && state.selectedProcess.parentId && (
        <RolesSpalte selectedProcess={state.selectedProcess} />
      )}
    </Box>
  );
}
