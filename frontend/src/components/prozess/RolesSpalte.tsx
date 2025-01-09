/**
 * @file RolesSpalte.tsx
 * @description Stellt den Bereich für die Prozess-Details inklusive der Rollen dar.
 *
 * @module RolesSpalte
 */

'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { Process } from '../../types/process.type';
import { JSX } from 'react';

interface RolesSpalteProps {
  selectedProcess: Process;
}

/**
 * Komponente für die Anzeige von Rollen eines Prozesses.
 *
 * @param {RolesSpalteProps} props - Eigenschaften der Komponente.
 * @returns {JSX.Element} - JSX-Element für die Rollen-Details.
 */
export default function RolesSpalte({ selectedProcess }: RolesSpalteProps): JSX.Element {
  const theme = useTheme(); // Theme verwenden

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 2,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 64px)',
        borderRadius: 4,
        boxShadow: `0px 4px 8px ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          position: 'sticky',
          top: 0,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.paper,
          zIndex: 1,
          padding: '12px 0',
          marginBottom: 2,
          borderBottom: `2px solid`,
          borderImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}) 1`,
          borderImageSlice: 1,
        }}
      >
        Editor: {selectedProcess.name}
      </Typography>
      {/* Zusätzliche Informationen zum Prozess */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Rollen</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Funktionen</th>
          </tr>
        </thead>
        <tbody>
          {selectedProcess.roles && selectedProcess.roles.length > 0 ? (
            selectedProcess.roles.map((role, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{role.roleName}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}></td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={2}
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                Keine Rollen verfügbar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  );
}
