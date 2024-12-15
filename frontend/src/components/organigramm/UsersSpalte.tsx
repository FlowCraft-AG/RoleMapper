'use client';

import { useMutation, useQuery } from '@apollo/client';
import { Delete, Visibility } from '@mui/icons-material';
import { Button, Modal, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import { ADD_FUNCTIONS } from '../../graphql/mutations/add-to-function';
import { REMOVE_FUNCTIONS } from '../../graphql/mutations/remove-to-function';
import { FUNCTIONS } from '../../graphql/queries/get-functions';
import client from '../../lib/apolloClient';
import theme from '../../theme';
import { Function, FunctionInfo } from '../../types/function.type';
import { getListItemStyles } from '../../utils/styles';

interface UsersColumnProps {
  selectedFunctionId: string;
  selectedMitglieder: FunctionInfo | undefined;
  onSelectUser: (userId: string) => void;
}

export default function UsersColumn({
  selectedFunctionId,
  selectedMitglieder,
  onSelectUser,
}: UsersColumnProps) {
  const { loading, error, data, refetch } = useQuery(FUNCTIONS, { client });
  const [addUserToFunction] = useMutation(ADD_FUNCTIONS, { client });
  const [removeUserFromFunction] = useMutation(REMOVE_FUNCTIONS, { client });
  const [selectedIndex, setSelectedIndex] = React.useState<string | undefined>(
    undefined,
  );
  const [open, setOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');

  let selectedFunction;

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Fehler: {error.message}</Alert>
      </Box>
    );

  if (selectedFunctionId === 'mitglieder') {
    selectedFunction = selectedMitglieder;
  } else {
    // Funktion suchen
    selectedFunction = data?.getData?.data?.find(
      (func: Function) => func._id === selectedFunctionId,
    );
  }

  if (!selectedFunction || selectedFunction.users.length === 0)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Keine Benutzer verfügbar.</Alert>
      </Box>
    );

  const handleViewUser = (userId: string) => {
    setSelectedIndex(userId);
    if (onSelectUser) {
      onSelectUser(userId);
    }
  };

  const handleAddUser = async () => {
    if (!newUserId.trim()) return;
    try {
      await addUserToFunction({
        variables: {
          functionName: selectedFunction.functionName,
          userId: newUserId,
        },
      });
      refetch(); // Aktualisiere die Daten nach der Mutation
      setNewUserId('');
      setOpen(false);
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Benutzers:', err);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromFunction({
        variables: {
          functionName: selectedFunction.functionName,
          userId,
        },
      });
      refetch(); // Aktualisiere die Benutzerliste
    } catch (err) {
      console.error('Fehler beim Entfernen des Benutzers:', err);
    }
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, p: 2 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 50, // Überschrift bleibt oben
          backgroundColor: theme.palette.background.default, // Hintergrundfarbe für die Überschrift
          zIndex: 1,
          padding: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ marginBottom: 2 }}
        >
          Benutzer hinzufügen
        </Button>
      </Box>

      <List>
        {selectedFunction.users.map((userId: string) => (
          <ListItem
            key={userId}
            selected={selectedIndex === userId}
            sx={getListItemStyles(theme, selectedIndex === userId)}
            disablePadding
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Details anzeigen">
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => handleViewUser(userId)}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Benutzer entfernen">
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleRemoveUser(userId)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemText primary={userId} />
          </ListItem>
        ))}
      </List>
      {/* Modal für Benutzer hinzufügen */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            fullWidth
            label="Benutzer-ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddUser}>
              Hinzufügen
            </Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
