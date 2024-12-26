'use client';

import { Add, Delete, Search } from '@mui/icons-material';
import {
  Button,
  ListItemButton,
  Snackbar,
  TextField,
  useTheme,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import {
  fetchSavedData,
  fetchUsersByFunction,
  removeUserFromFunction,
} from '../../app/organisationseinheiten/fetchkp';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';
import { FunctionInfo } from '../../types/function.type';
import { getListItemStyles } from '../../utils/styles';
import AddUserModal from '../modal/AddUserModal';

interface UsersColumnProps {
  selectedFunctionId: string;
  selectedMitglieder: FunctionInfo | undefined;
  onSelectUser: (userId: string) => void;
  onRemove: (userId: string, functionId: string) => void;
  isImpliciteFunction: boolean;
}

export default function UsersSpalte({
  selectedFunctionId,
  selectedMitglieder,
  onSelectUser,
  onRemove,
  isImpliciteFunction,
}: UsersColumnProps) {
  console.log('USERS SPALTE');
  console.log('selectedFunctionId: ', selectedFunctionId);
  console.log('selectedMitglieder: ', selectedMitglieder);
  console.log('isImpliciteFunction: ', isImpliciteFunction);
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [errors] = useState<{ [key: string]: string | null }>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [selectedFunction, setSelectedFunction] = useState<
    FunctionInfo | undefined
  >(undefined);
  const [selectedIndex, setSelectedIndex] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Filtere Benutzer basierend auf der Suchanfrage
    if (selectedFunction && selectedFunction.users) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = selectedFunction.users.filter((user) =>
        user.toLowerCase().includes(lowercasedTerm),
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, selectedFunction]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        if (selectedFunctionId === 'mitglieder') {
          setSelectedFunction(selectedMitglieder);
        } else if (isImpliciteFunction) {
          const data = await fetchSavedData(selectedFunctionId);
          setSelectedFunction(data);
        } else {
          const data = await fetchUsersByFunction(selectedFunctionId);
          setSelectedFunction(data);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Benutzer:', err);
        setError('Fehler beim Laden der Benutzer');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedFunctionId, isImpliciteFunction, selectedMitglieder]);

  const refetch = () => {
    console.log('Refetching Functions');
    // refetch wird benötigt
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromFunction(selectedFunction!.functionName, userId);
      setSelectedFunction((prev) => ({
        ...prev!,
        users: prev?.users.filter((id) => id !== userId) || [],
      }));
      onRemove(userId, selectedFunctionId);
      setSnackbar({ open: true, message: 'Benutzer erfolgreich entfernt' });
    } catch (err) {
      console.error('Fehler beim Entfernen des Benutzers:', err);
      setSnackbar({
        open: true,
        message: 'Fehler beim Entfernen des Benutzers',
      });
    }
  };

  const handleViewUser = (userId: string) => {
    setSelectedIndex(userId);
    onSelectUser(userId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Fehler: {error}</Alert>
      </Box>
    );
  }
  //   let selectedFunction: FunctionInfo | undefined;
  //   if (selectedFunctionId === 'mitglieder') {
  //     selectedFunction = selectedMitglieder;
  //     console.log('Mitglieder: selectedFunction: ', selectedFunction);
  //   } else if (isImpliciteFunction === true) {
  //     // Funktion suchen
  //     selectedFunction = savedData?.getSavedData;
  //     console.log('Implizite Funktion: selectedFunction: ', selectedFunction);
  //   } else {
  //     // Funktion suchen
  //     selectedFunction = usersData?.getData?.data?.[0];
  //     console.log('Explizite Funktion: selectedFunction: ', selectedFunction);
  //   }

  //   // Verwende zwei Queries, eine für den normalen Fall und eine für das "implizite" Szenario
  //   const {
  //     loading: usersLoading,
  //     error: usersError,
  //     data: usersData,
  //     refetch: refetch,
  //   } = useQuery(USERS_BY_FUNCTION, {
  //     client,
  //     variables: { functionId: selectedFunctionId },
  //     skip: selectedFunctionId === 'mitglieder' || isImpliciteFunction === true, // Query wird übersprungen
  //   });

  //   const {
  //     loading: savedDataLoading,
  //     error: savedDataError,
  //     data: savedData,
  //   } = useQuery(GET_SAVED_DATA, {
  //     client,
  //     variables: { id: selectedFunctionId },
  //     skip:
  //       selectedFunctionId === 'mitglieder' ||
  //       isImpliciteFunction === false ||
  //       isImpliciteFunction === undefined, // Query wird übersprungen, wenn implizit
  //   });
  //   const [addUserToFunction] = useMutation(ADD_FUNCTIONS, { client });

  //   const validateInput = () => {
  //     const newErrors: { [key: string]: string | null } = {};
  //     const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/; // 4 Buchstaben + 4 Zahlen

  //     if (!newUserId.trim()) {
  //       newErrors.userId = 'Der UserId darf nicht leer sein.';
  //     }

  //     // Validierung für `users`
  //     if (!userIdRegex.test(newUserId)) {
  //       newErrors.userId =
  //         'Benutzernamen müssen 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
  //     }

  //     setErrors(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };

  //   const handleAddUser = async () => {
  //     if (!validateInput()) {
  //       return;
  //     }
  //     try {
  //       await addUserToFunction({
  //         variables: {
  //           functionName: selectedFunction?.functionName,
  //           userId: newUserId,
  //         },
  //       });
  //       refetch(); // Aktualisiere die Daten nach der Mutation
  //       setNewUserId('');
  //       setOpen(false);
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         setSnackbar({
  //           open: true,
  //           message: err.message,
  //         });
  //         const newErrors: { [key: string]: string | null } = {};
  //         newErrors.userId = err.message;
  //         setErrors(newErrors);
  //         setNewUserId('');
  //       } else {
  //         setSnackbar({
  //           open: true,
  //           message: 'Fehler beim Speichern der Funktion.',
  //         });
  //       }
  //     }
  //   };

  //   const handleRemoveUser = async (userId: string) => {
  //     try {
  //       await removeUserFromFunction({
  //         variables: {
  //           functionName: selectedFunction?.functionName,
  //           userId,
  //         },
  //       });
  //       refetch(); // Aktualisiere die Benutzerliste
  //       onRemove(userId, '');
  //       setSelectedIndex(undefined);
  //       onSelectUser('');
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         setSnackbar({
  //           open: true,
  //           message: err.message,
  //         });
  //       } else {
  //         setSnackbar({
  //           open: true,
  //           message: 'Fehler beim Speichern der Funktion.',
  //         });
  //       }
  //     }
  //   };

  return (
    <Box sx={{ minHeight: 352, minWidth: 250, p: 2 }}>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />

      <Box
        sx={{
          position: 'sticky',
          top: 50, // Überschrift bleibt oben
          backgroundColor: theme.palette.background.default, // Hintergrundfarbe für die Überschrift
          zIndex: 1,
          padding: 1,
          //   display: 'flex', // Flexbox aktivieren
          //   alignItems: 'center', // Vertikal ausrichten
          //   gap: 2, // Abstand zwischen Button und Suchfeld
        }}
      >
        {!isImpliciteFunction && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            startIcon={<Add />}
            sx={{
              width: '100%', // Vollbreite
              marginBottom: 2, // Abstand zum Textfeld
              height: 40, // Einheitliche Höhe
            }}
          >
            Benutzer hinzufügen
          </Button>
        )}

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Benutzer suchen..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
          sx={{
            height: 40, // Einheitliche Höhe
            '.MuiOutlinedInput-root': {
              height: '100%', // Input-Container passt sich an
            },
          }}
        />
      </Box>

      <List>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((userId: string) => (
            <ListItemButton
              key={userId}
              sx={getListItemStyles(theme, selectedIndex === userId)}
              onClick={() => handleViewUser(userId)}
            >
              <ListItemText primary={userId} />
              {/* Entfernen-Icon nur anzeigen, wenn die Funktion nicht implizit ist */}
              {!isImpliciteFunction && (
                <Tooltip title="Benutzer entfernen">
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => {
                      if (!isImpliciteFunction) {
                        handleRemoveUser(userId);
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </ListItemButton>
          ))
        ) : (
          <Box sx={{ p: 2 }}>
            <Alert severity="info">Keine Benutzer gefunden</Alert>
          </Box>
        )}
      </List>
      {/* Modal für Benutzer hinzufügen */}
      {!isImpliciteFunction && (
        <AddUserModal
          open={open}
          onClose={() => setOpen(false)}
          errors={errors}
          newUserId={newUserId}
          setNewUserId={setNewUserId}
          refetch={refetch}
          functionName={selectedFunction?.functionName}
        />
      )}
    </Box>
  );
}
