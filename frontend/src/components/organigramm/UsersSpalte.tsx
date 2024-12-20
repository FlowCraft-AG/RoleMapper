'use client';

import { useMutation, useQuery } from '@apollo/client';
import { Add, Delete } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  ListItemButton,
  Modal,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { ADD_FUNCTIONS } from '../../graphql/mutations/add-to-function';
import { REMOVE_FUNCTIONS } from '../../graphql/mutations/remove-to-function';
import { USERS_BY_FUNCTION } from '../../graphql/queries/get-functions';
import client from '../../lib/apolloClient';
import theme from '../../theme';
import { FunctionInfo } from '../../types/function.type';
import { getLogger } from '../../utils/logger';
import { getListItemStyles } from '../../utils/styles';

interface UsersColumnProps {
  selectedFunctionId: string;
  selectedMitglieder: FunctionInfo | undefined;
  onSelectUser: (userId: string) => void;
  onRemove: (userId: string, functionId: string) => void;
}

export default function UsersSpalte({
  selectedFunctionId,
  selectedMitglieder,
  onSelectUser,
  onRemove,
}: UsersColumnProps) {
  const logger = getLogger(UsersSpalte.name);
  const { loading, error, data, refetch } = useQuery(USERS_BY_FUNCTION, {
    client,
    variables: { functionId: selectedFunctionId },
    skip: selectedFunctionId === 'mitglieder', // Query wird übersprungen
  });
  const [addUserToFunction] = useMutation(ADD_FUNCTIONS, { client });
  const [removeUserFromFunction] = useMutation(REMOVE_FUNCTIONS, { client });
  const [selectedIndex, setSelectedIndex] = useState<string | undefined>(
    undefined,
  );
  const [open, setOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

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
    selectedFunction = data?.getData?.data?.[0];
  }

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
          functionName: selectedFunction.functionName,
          userId: newUserId,
        },
      });
      refetch(); // Aktualisiere die Daten nach der Mutation
      setNewUserId('');
      setOpen(false);
    } catch (err) {
      logger.error('Fehler beim Hinzufügen des Benutzers:', err);

      const newErrors: { [key: string]: string | null } = {};
      newErrors.userId = (err as any).message;
      setErrors(newErrors);
      setNewUserId('');
    }
  };
  if (!selectedFunction || selectedFunction.users.length === 0)
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
            startIcon={<Add />}
          >
            Benutzer hinzufügen
          </Button>
        </Box>

        <Alert severity="info">Keine Benutzer verfügbar.</Alert>
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
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddUser}
              >
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

  const handleViewUser = (userId: string) => {
    setSelectedIndex(userId);
    if (onSelectUser) {
      onSelectUser(userId);
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
      onRemove(userId, '');
      setSelectedIndex(undefined);
      onSelectUser('');
    } catch (err) {
      console.error('Fehler beim Entfernen des Benutzers:', err);
    }
  };

  const options = [
    'gycm1011',
    'lufr1012',
    'gyca1013',
    'lufr1014',
    'gyca1015',
    'lufr1016',
  ];

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
          startIcon={<Add />}
        >
          Benutzer hinzufügen
        </Button>
      </Box>

      <List>
        {selectedFunction.users.map((userId: string) => (
          <ListItemButton
            key={userId}
            sx={getListItemStyles(theme, selectedIndex === userId)}
            onClick={() => handleViewUser(userId)}
          >
            <ListItemText primary={userId} />
            <Tooltip title="Benutzer entfernen">
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleRemoveUser(userId)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </ListItemButton>
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
                label="Datalist example"
                placeholder="Type to search..."
              />
            )}
            freeSolo // Erlaubt benutzerdefinierte Eingaben
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              gap: 2,
            }}
          >
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
