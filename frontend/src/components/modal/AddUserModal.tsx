// src/components/modals/AddUserModal.tsx

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  darken,
  lighten,
  Modal,
  Snackbar,
  styled,
  TextField,
} from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { useEffect, useState } from 'react';
import {
  addUserToFunction,
  fetchUserIds,
} from '../../app/organisationseinheiten/fetchkp';
import { FunctionInfo } from '../../types/function.type';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  errors: { [key: string]: string | null };
  newUserId: string;
  setNewUserId: React.Dispatch<React.SetStateAction<string>>;
  refetch: (FunctionInfo: FunctionInfo) => void;
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

  const options: string[] = userIds;

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
          <Autocomplete
            options={options}
            loading={loading}
            groupBy={(option) => option[0].toUpperCase()}
            getOptionLabel={(option) => option}
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supervisor"
                placeholder="Supervisor auswählen"
                error={!!errors.supervisor}
                helperText={errors.supervisor || ''}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading && (
                          <CircularProgress color="inherit" size={20} />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
            value={newUserId}
            onChange={(_, newValue) => setNewUserId(newValue || '')}
            renderOption={(props, option, { inputValue }) => {
              const matches = match(option, inputValue, {
                insideWords: true,
              });
              const parts = parse(option, matches);

              return (
                <li {...props} key={props.key}>
                  {/* <li key={props.key}></li> */}
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
