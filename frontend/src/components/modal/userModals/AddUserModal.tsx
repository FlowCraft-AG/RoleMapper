// src/components/modals/AddUserModal.tsx

import { Box, Button, Modal, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { addUserToFunction } from '../../../lib/api/function.api';
import { fetchUserIds } from '../../../lib/api/user.api';
import { ShortFunction } from '../../../types/function.type';
import { ShortUser } from '../../../types/user.type';
import UserAutocomplete from '../../UserAutocomplete';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  errors: { [key: string]: string | undefined };
  newUserId: string;
  setNewUserId: React.Dispatch<React.SetStateAction<string>>;
  refetch: (FunctionInfo: ShortFunction) => void;
  functionName: string | undefined;
  functionId: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  newUserId,
  setNewUserId,
  refetch,
  functionName,
  functionId,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [userIds, setUserIds] = useState<ShortUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUserIds: ShortUser[] = await fetchUserIds();
      setUserIds(fetchedUserIds);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer-IDs:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Laden der Benutzer-IDs.',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateInput = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/; // 4 Buchstaben + 4 Zahlen

    if (!newUserId.trim()) {
      newErrors.userId = 'Der UserId darf nicht leer sein.';
    }

    // Validierung für `users`
    if (!userIdRegex.test(newUserId)) {
      newErrors.userId =
        'Benutzernamen müssen 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
    }

    console.log('errors:', errors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      const newUserList = await addUserToFunction(
        functionName!,
        newUserId,
        functionId,
      );
      refetch(newUserList); // Aktualisiere die Daten nach der Mutation
      setNewUserId('');
      onClose();
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Benutzers:', err);
      setSnackbar({
        open: true,
        message: 'Fehler beim Hinzufügen des Benutzers.',
      });
      const newErrors: { [key: string]: string | undefined } = {};
      if (err instanceof Error) {
        newErrors.userId = err.message;
      }
      setErrors(newErrors);
      setNewUserId('');
    }
  };

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
          <UserAutocomplete
            options={userIds}
            loading={loading}
            value={userIds.find((id) => id.userId === newUserId) || undefined}
            onChange={(value) => {
              if (!Array.isArray(value)) {
                setNewUserId(value?.userId || '');
              }
            }}
            displayFormat="full"
            label="Benutzer auswählen"
            placeholder="Benutzer-ID suchen..."
            helperText={errors.userId}
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
