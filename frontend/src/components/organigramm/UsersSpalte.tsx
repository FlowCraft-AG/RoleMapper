/**
 * Stellt die Spalte für Benutzer einer ausgewählten Funktion dar.
 * Diese Komponente bietet Funktionen zur Anzeige, Suche, Hinzufügung und Entfernung von Benutzern.
 *
 * @module UsersSpalte
 */

'use client';

import { Add, Delete, Search, SwapHoriz } from '@mui/icons-material';
import {
  Button,
  ListItemButton,
  Snackbar,
  TextField,
  useTheme,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchSavedData,
  fetchUsersByFunction,
  removeUserFromFunction,
} from '../../lib/api/rolemapper/function.api';
import { FunctionUser } from '../../types/function.type';
import { User } from '../../types/user.type';
import { getListItemStyles } from '../../utils/styles';
import AddUserModal from '../modal/userModals/AddUserModal';

/**
 * Props für die `UsersSpalte`-Komponente.
 *
 * @interface UsersColumnProps
 * @property {string} selectedFunctionId - Die ID der ausgewählten Funktion.
 * @property {FunctionUser | undefined} selectedMitglieder - Die Liste der Mitglieder für die Funktion.
 * @property {function} onSelectUser - Callback-Funktion, die aufgerufen wird, wenn ein Benutzer ausgewählt wird.
 * @property {function} onRemove - Callback-Funktion, um Benutzer aus der Funktion zu entfernen.
 * @property {boolean} isImpliciteFunction - Gibt an, ob die Funktion implizit ist.
 * @property {boolean} isSingleUser - Gibt an, ob die Funktion nur von einem Benutzer belegt werden kann.
 */
interface UsersColumnProps {
  selectedFunctionId: string;
  selectedMitglieder: FunctionUser | undefined;
  onSelectUser: (userId: string) => void;
  onRemove: (ids: string[]) => void; // Übergibt ein Array von IDs
  isImpliciteFunction: boolean;
  isSingleUser: boolean;
}

/**
 * `UsersSpalte` zeigt die Benutzer einer Funktion an und bietet Verwaltungsfunktionen.
 *
 * - Unterstützt die Anzeige von Benutzern basierend auf der Funktion.
 * - Ermöglicht das Hinzufügen, Ersetzen oder Entfernen von Benutzern.
 * - Bietet eine Suchfunktion, um Benutzer effizient zu finden.
 *
 * @component
 * @param {UsersColumnProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Benutzer-Spalte.
 *
 * @example
 * <UsersSpalte
 *   selectedFunctionId="12345"
 *   selectedMitglieder={mitgliederData}
 *   onSelectUser={(userId) => console.log(userId)}
 *   onRemove={(ids) => console.log(ids)}
 *   isImpliciteFunction={false}
 *   isSingleUser={true}
 * />
 */
export default function UsersSpalte({
  selectedFunctionId,
  selectedMitglieder,
  onSelectUser,
  onRemove,
  isImpliciteFunction,
  isSingleUser,
}: UsersColumnProps) {
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  //const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [selectedFunction, setSelectedFunction] = useState<
    FunctionUser | undefined
  >(undefined);
  const [selectedIndex, setSelectedIndex] = useState<string | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | undefined>(undefined);

  /**
   * Lädt die Benutzer basierend auf der ausgewählten Funktion.
   *
   * @async
   * @function loadFunctions
   * @returns {Promise<void>}
   */
  const loadFunctions = useCallback(async () => {
    // setLoading(true);
    setError(undefined);
    try {
      if (selectedFunctionId === 'mitglieder') {
        console.log('Fetching mitglieder');
        console.log('Selected Mitglieder:', selectedMitglieder);
        setSelectedFunction(selectedMitglieder);
      } else if (isImpliciteFunction) {
        console.log('Fetching saved data');
        const data = await fetchSavedData(selectedFunctionId);
        setSelectedFunction(data);
      } else {
        console.log('Fetching users by function');
        const data: FunctionUser =
          await fetchUsersByFunction(selectedFunctionId);
        console.log('Data:', selectedFunctionId);
        setSelectedFunction(data);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Benutzer:', err);
      setError('Fehler beim Laden der Benutzer');
    } finally {
      //   setLoading(false);
    }
  }, [selectedFunctionId, selectedMitglieder, isImpliciteFunction]); // Die Funktion wird nur beim ersten Laden ausgeführt

  /**
   * Filtert Benutzer basierend auf der Suchanfrage.
   */
  useEffect(() => {
    // Filtere Benutzer basierend auf der Suchanfrage
    if (selectedFunction && selectedFunction.users) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = selectedFunction.users.filter((user) =>
        user.userId.toLowerCase().includes(lowercasedTerm),
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, selectedFunction]);

  /**
   * Handhabt Änderungen in der Suchleiste.
   *
   * @function handleSearchChange
   * @param {React.ChangeEvent<HTMLInputElement>} event - Das Eingabe-Event.
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (selectedFunctionId) {
      loadFunctions();
    }
  }, [selectedFunctionId, loadFunctions]);

  /**
   * Aktualisiert die Benutzerliste, nachdem Änderungen vorgenommen wurden.
   *
   * @function refetch
   * @param {FunctionUser} functionInfo - Die aktualisierte Funktion mit Benutzern.
   */
  const refetch = (functionInfo: FunctionUser) => {
    setSelectedFunction(functionInfo); // Aktualisiere den Zustand
    setFilteredUsers(functionInfo.users); // Aktualisiere die gefilterte Liste
    setSearchTerm(''); // Suchfeld zurücksetzen
  };

  /**
   * Entfernt einen Benutzer aus der Funktion.
   *
   * @async
   * @function handleRemoveUser
   * @param {string} userId - Die ID des Benutzers, der entfernt werden soll.
   */
  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromFunction(
        selectedFunction!.functionName,
        userId,
        selectedFunctionId,
      );
      setSelectedFunction((prev) => ({
        ...prev!,
        users: prev?.users.filter((id) => id.userId !== userId) || [],
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

  /**
   * Wählt einen Benutzer aus und zeigt dessen Details an.
   *
   * @function handleViewUser
   * @param {string} userId - Die ID des ausgewählten Benutzers.
   */
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
            startIcon={isSingleUser ? <SwapHoriz /> : <Add />}
            sx={{
              width: '100%', // Vollbreite
              marginBottom: 2, // Abstand zum Textfeld
              height: 40, // Einheitliche Höhe
            }}
          >
            {isSingleUser ? 'Benutzer ersetzen' : 'Benutzer hinzufügen'}
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
          filteredUsers.map((user: User) => (
            <ListItemButton
              key={user.userId}
              sx={getListItemStyles(theme, selectedIndex === user.userId)}
              onClick={() => handleViewUser(user.userId)}
            >
              <ListItemText
                primary={`${user.profile?.lastName} ${user.profile?.firstName} (${user.userId})`}
              />
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
                        handleRemoveUser(user.userId);
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
          refetch={refetch}
          selectedFunction={selectedFunction}
          isSingleUser={isSingleUser}
        />
      )}
    </Box>
  );
}
