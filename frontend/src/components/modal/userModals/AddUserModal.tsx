// src/components/modals/AddUserModal.tsx

import {
  Box,
  Button,
  darken,
  lighten,
  Modal,
  Snackbar,
  styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  addUserToFunction,
  fetchUserIds,
} from '../../../app/organisationseinheiten/fetchkp';
import { FunctionInfo2 } from '../../../types/function.type';
import { UserCredetials } from '../../../types/user.type';
import UserAutocomplete from '../../utils/UserAutocomplete';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  errors: { [key: string]: string | null };
  newUserId: string;
  setNewUserId: React.Dispatch<React.SetStateAction<string>>;
  refetch: (FunctionInfo: FunctionInfo2) => void;
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
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [userIds, setUserIds] = useState<UserCredetials[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUserIds: UserCredetials[] = await fetchUserIds();
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
      console.log('newUserList:', newUserList);
      console.log('Benutzer erfolgreich hinzugefügt');
      refetch(newUserList); // Aktualisiere die Daten nach der Mutation
      setNewUserId('');
      onClose();
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Benutzers:', err);
      setSnackbar({
        open: true,
        message: 'Fehler beim Hinzufügen des Benutzers.',
      });
      const newErrors: { [key: string]: string | null } = {};
      if (err instanceof Error) {
        newErrors.userId = err.message;
      }
      setErrors(newErrors);
      setNewUserId('');
    }
  };

  const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles('dark', {
      backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
  }));

  const GroupItems = styled('ul')({
    padding: 0,
  });

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
            value={userIds.find((id) => id.userId === newUserId) || null}
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
