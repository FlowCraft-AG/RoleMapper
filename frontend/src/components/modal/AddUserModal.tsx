// src/components/modals/AddUserModal.tsx

import { useMutation, useQuery } from '@apollo/client';
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Snackbar,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { ADD_FUNCTIONS } from '../../graphql/mutations/add-to-function';
import { USER_IDS } from '../../graphql/queries/get-users';
import client from '../../lib/apolloClient';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (userId: string) => void;
  errors: { [key: string]: string | null };
  newUserId: string;
  setNewUserId: React.Dispatch<React.SetStateAction<string>>;
  refetch: () => void;
  functionName: string | undefined;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  onAddUser,
  newUserId,
  setNewUserId,
  refetch,
  functionName,
}) => {
  const [addUserToFunction] = useMutation(ADD_FUNCTIONS, { client });
  const { loading, error, data } = useQuery(USER_IDS, {
    client,
  });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const validateInput = () => {
    const newErrors: { [key: string]: string | null } = {};
    const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/; // 4 Buchstaben + 4 Zahlen

    if (!newUserId.trim()) {
      newErrors.userId = 'Der UserId darf nicht leer sein.';
    }

    // Validierung für `users`
    if (!userIdRegex.test(newUserId)) {
      newErrors.userId =
        'Benutzernamen müssen 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      await addUserToFunction({
        variables: {
          functionName,
          userId: newUserId,
        },
      });
      console.log('Benutzer erfolgreich hinzugefügt');
      refetch(); // Aktualisiere die Daten nach der Mutation
      setNewUserId('');
      onClose();
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Benutzers:', err);
      setSnackbar({
        open: true,
        message: 'Fehler beim Hinzufügen des Benutzers:',
      });

      const newErrors: { [key: string]: string | null } = {};
      newErrors.userId = (err as any).message;
      setErrors(newErrors);
      setNewUserId('');
    }
  };

  const options = data?.getData.data.map((user: any) => user.userId) || [];

  return (
    <>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
      <Modal open={open} onClose={onClose}>
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
            error={!!errors.userId}
            helperText={errors.userId}
            label="Benutzer-ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          />

          <Autocomplete
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Benutzer-ID"
                placeholder="eingabe..."
              />
            )}
            freeSolo // Erlaubt benutzerdefinierte Eingaben
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddUser}>
              Hinzufügen
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Abbrechen
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddUserModal;
