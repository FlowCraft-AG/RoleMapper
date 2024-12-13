'use client';

import { useMutation, useQuery } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { FUNCTIONS } from '../../graphql/queries/get-functions';
import client from '../../lib/apolloClient';
import { ADD_FUNCTIONS } from '../../graphql/mutations/add-to-function';
import { REMOVE_FUNCTIONS } from '../../graphql/mutations/remove-to-function';
import ListItemButton from '@mui/material/ListItemButton';
import theme from '../../theme';
import { getListItemStyles } from '../../utils/styles';


export type Function = {
  _id: string;
  functionName: string;
  users: string[];
  orgUnit: string;
};

interface UsersColumnProps {
  selectedFunctionId: string;
}

export default function UsersColumn({ selectedFunctionId }: UsersColumnProps) {
  const [open, setOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [addUserToFunction] = useMutation(ADD_FUNCTIONS, { client });
  const [removeUserFromFunction] = useMutation(REMOVE_FUNCTIONS, { client });

  const { loading, error, data, refetch } = useQuery(FUNCTIONS, { client });

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

  // Funktion suchen
  const selectedFunction: Function | undefined = data?.getData?.data?.find(
    (func: Function) => func._id === selectedFunctionId,
  );

  if (!selectedFunction)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Keine Benutzer verfügbar.</Alert>
      </Box>
    );

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
      refetch(); // Aktualisiere die Daten nach der Mutation
    } catch (err) {
      console.error('Fehler beim Entfernen des Benutzers:', err);
    }
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, p: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Benutzer hinzufügen
      </Button>

      <List>
        {selectedFunction.users.map((userId) => (
          <ListItem
            key={userId}
            secondaryAction={
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleRemoveUser(userId)}
              >
                <DeleteIcon />
              </IconButton>
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
