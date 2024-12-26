// src/components/modals/AddUserModal.tsx

import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Snackbar,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  addUserToFunction,
  fetchUserIds,
} from '../../app/organisationseinheiten/fetchkp';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  errors: { [key: string]: string | null };
  newUserId: string;
  setNewUserId: React.Dispatch<React.SetStateAction<string>>;
  refetch: () => void;
  functionName: string | undefined;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  newUserId,
  setNewUserId,
  refetch,
  functionName,
}) => {
  //   const [addUserToFunction] = useMutation(ADD_FUNCTIONS, { client });
  //   const { data } = useQuery(USER_IDS, {
  //     client,
  //   });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [userIds, setUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUserIds = await fetchUserIds();
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateInput()) {
      return;
    }
    try {
      await addUserToFunction(functionName!, newUserId);
      console.log('Benutzer erfolgreich hinzugefügt');
      refetch(); // Aktualisiere die Daten nach der Mutation
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

  //   const options: string[] =
  //     data?.getData.data.map((user: User) => user.userId) || [];

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
          {/* <TextField
            fullWidth
            error={!!errors.userId}
            helperText={errors.userId}
            label="Benutzer-ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          /> */}

          <Autocomplete
            options={userIds}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Benutzer-ID"
                placeholder="eingabe..."
              />
            )}
            value={newUserId}
            onChange={(_, newValue) => setNewUserId(newValue || '')}
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
