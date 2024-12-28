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
import { useCallback, useEffect, useState } from 'react';
import {
  fetchSavedData,
  fetchUsersByFunction,
  removeUserFromFunction,
} from '../../app/organisationseinheiten/fetchkp';
import { FunctionInfo } from '../../types/function.type';
import { getListItemStyles } from '../../utils/styles';
import AddUserModal from '../modal/AddUserModal';

interface UsersColumnProps {
  selectedFunctionId: string;
  selectedMitglieder: FunctionInfo | undefined;
  onSelectUser: (userId: string) => void;
  onRemove: (ids: string[]) => void; // Übergibt ein Array von IDs
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
  //const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

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

  const loadFunctions = useCallback(async () => {
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
  }, [selectedFunctionId, selectedMitglieder, isImpliciteFunction]); // Die Funktion wird nur beim ersten Laden ausgeführt

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
    if (selectedFunctionId) {
      loadFunctions();
    }
  }, [selectedFunctionId, loadFunctions]);

  const refetch = (functionInfo: FunctionInfo) => {
    console.log('Refetching Functions');
    setSelectedFunction(functionInfo); // Aktualisiere den Zustand
    setFilteredUsers(functionInfo.users); // Aktualisiere die gefilterte Liste
    setSearchTerm(''); // Suchfeld zurücksetzen
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromFunction(
        selectedFunction!.functionName,
        userId,
        selectedFunctionId,
      );
      setSelectedFunction((prev) => ({
        ...prev!,
        users: prev?.users.filter((id) => id !== userId) || [],
      }));
      onRemove([userId]);
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

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Fehler: {error}</Alert>
      </Box>
    );
  }

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
          top: 58, // Überschrift bleibt oben
          backgroundColor: theme.palette.background.default, // Hintergrundfarbe für die Überschrift
          zIndex: 1,
          padding: 1,
          //   display: 'flex', // Flexbox aktivieren
          //   alignItems: 'center', // Vertikal ausrichten
          //   gap: 2, // Abstand zwischen Button und Suchfeld
        }}
      >
        {!isImpliciteFunction && selectedFunctionId !== 'mitglieder' && (
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
        {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    )
        :filteredUsers.length > 0 ? (
          filteredUsers.map((userId: string) => (
            <ListItemButton
              key={userId}
              sx={getListItemStyles(theme, selectedIndex === userId)}
              onClick={() => handleViewUser(userId)}
            >
              <ListItemText primary={userId} />
              {/* Entfernen-Icon nur anzeigen, wenn die Funktion nicht implizit ist */}
              {!isImpliciteFunction && selectedFunctionId !== 'mitglieder' && (
                <Tooltip title="Benutzer entfernen">
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        !isImpliciteFunction &&
                        selectedFunctionId !== 'mitglieder'
                      ) {
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
      {!isImpliciteFunction && selectedFunctionId !== 'mitglieder' && (
        <AddUserModal
          open={open}
          onClose={() => setOpen(false)}
          errors={errors}
          newUserId={newUserId}
          setNewUserId={setNewUserId}
          refetch={refetch}
          functionName={selectedFunction?.functionName}
          functionId={selectedFunctionId}
        />
      )}
    </Box>
  );
}
