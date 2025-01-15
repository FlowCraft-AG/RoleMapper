/**
 * @file ExistingRolesModal.tsx
 * @description Modal-Komponente mit Autocomplete zur Auswahl vorhandener Rollen.
 *
 * @module ExistingRolesModal
 */

import {
  Autocomplete,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { JSX, useState } from 'react';
import { Role } from '../../../types/role.type';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { GroupHeader, GroupItems } from '../../../styles/GroupStyles';

interface ExistingRolesModalProps {
  open: boolean;
  onClose: () => void;
  collectionRoles: Role[] | undefined;
  onSelectRole: (role: Role | null) => void; // Callback für die Auswahl einer Rolle
}

const ExistingRolesModal = ({
  open,
  onClose,
  collectionRoles,
  onSelectRole,
}: ExistingRolesModalProps): JSX.Element => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSelect = (role: Role | null) => {
    setSelectedRole(role);
    onSelectRole(role); // Callback aufrufen
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: 400,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" align="center">
          Existierende Rollen
        </Typography>

        {/* Autocomplete-Feld für die Auswahl der Rollen */}
        <Autocomplete
          options={collectionRoles || []} // Optionen sind die Rollen
          groupBy={(option) => option.name[0]}
          renderGroup={(params) => (
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <GroupItems>{params.children}</GroupItems>
            </li>
          )}
          getOptionLabel={(option) => option.name || 'Unbenannte Rolle'} // Anzeige des Rollennamens
          renderInput={(params) => (
            <TextField
              {...params}
              label="Rollen auswählen"
              variant="outlined"
            />
          )}
          value={selectedRole}
          renderOption={(props, option, { inputValue }) => {
            const label = option.name;
            const matches = match(label, inputValue, { insideWords: true });
            const parts = parse(label, matches);

            return (
              <li {...props} key={option.roleId}>
                <div>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            );
          }}
          onChange={(_, value) => handleSelect(value)}
          isOptionEqualToValue={(option, value) =>
            option.roleId === value?.roleId
          } // Vergleich basierend auf roleId
          sx={{
            '& .MuiAutocomplete-option': {
              padding: '8px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
              },
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onClose();
            }}
            disabled={!selectedRole}
          >
            Bestätigen
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExistingRolesModal;
