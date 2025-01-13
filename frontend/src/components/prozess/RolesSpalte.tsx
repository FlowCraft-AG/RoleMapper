/**
 * @file RolesSpalte.tsx
 * @description Stellt den Bereich für die Prozess-Details inklusive der Rollen dar.
 *
 * @module RolesSpalte
 */

'use client';

import { Box, Typography, useTheme, Button } from '@mui/material';
import { Process } from '../../types/process.type';
import { useState } from 'react';
import { JSX } from 'react';
import { Add } from '@mui/icons-material';
import NewRoleModal from '../modal/processModals/AddNewRoleModal';
import SelectAddRoleModal from '../modal/processModals/SelectAddRoleModal';
import ExistingRolesModal from '../modal/processModals/AddExistingRoleModal';

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
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [newRoleModalOpen, setNewRoleModalOpen] = useState(false);
  const [existingRolesModalOpen, setExistingRolesModalOpen] = useState(false);

  // Handler für das Öffnen und Schließen der Modale
  const handleAddRole = () => {
    setSelectModalOpen(true);
  };

  const handleSelectModalClose = () => {
    setSelectModalOpen(false);
  };

  const handleNewRoleModalOpen = () => {
    setSelectModalOpen(false);
    setNewRoleModalOpen(true);
  };

  const handleNewRoleModalClose = () => {
    setNewRoleModalOpen(false);
  };

  const handleExistingRolesModalOpen = () => {
    setSelectModalOpen(false);
    setExistingRolesModalOpen(true);
  };

  const handleExistingRolesModalClose = () => {
    setExistingRolesModalOpen(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 2,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 64px)',
        borderRadius: 4,
        width: '50%',
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

      {/* Button zum Hinzufügen von Rollen */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddRole}
        sx={{
          marginTop: 2,
          width: '100%',
          padding: '10px',
          fontWeight: 'bold',
          textTransform: 'none',
        }}
        startIcon={<Add />}
      >
        Rolle hinzufügen
      </Button>

      {/* Modal für Auswahl */}
      <SelectAddRoleModal
        open={selectModalOpen}
        onClose={handleSelectModalClose}
        onSelectType={(type) => {
          if (type === 'explizite') {
            handleNewRoleModalOpen();
          } else if (type === 'implizite') {
            handleExistingRolesModalOpen();
          }
        }}
      />

      {/* Modal für neue Rolle */}
      <NewRoleModal open={newRoleModalOpen} onClose={handleNewRoleModalClose} />

      {/* Modal für existierende Rollen */}
      <ExistingRolesModal open={existingRolesModalOpen} onClose={handleExistingRolesModalClose} />

      {/* Button zum Zuweisen der Funktionen */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          marginTop: 2,
          width: '100%',
          padding: '10px',
          fontWeight: 'bold',
          textTransform: 'none',
        }}
        startIcon={<Add />}
      >
        Funktionen zuweisen
      </Button>

      {/* Platz für zukünftige Modale für "Funktionen zuweisen" */}
      {/* Hier Modale für "Funktionen zuweisen" einfügen */}
    </Box>
  );
}
