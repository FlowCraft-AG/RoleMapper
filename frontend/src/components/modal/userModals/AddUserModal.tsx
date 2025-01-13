/**
 * @file AddUserModal.tsx
 * @description Modal-Komponente für das Hinzufügen oder Ersetzen eines Benutzers in einer Funktion.
 *
 * @module AddUserModal
 */
import { SwapHoriz } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Modal,
  Snackbar,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { addUserToFunction } from '../../../lib/api/rolemapper/function.api';
import { fetchUserIds } from '../../../lib/api/rolemapper/user.api';
import { FunctionUser } from '../../../types/function.type';
import { ShortUser } from '../../../types/user.type';
import UserAutocomplete from '../../UserAutocomplete';

/**
 * Props für die `AddUserModal`-Komponente.
 *
 * @interface AddUserModalProps
 * @property {boolean} open - Gibt an, ob das Modal geöffnet ist.
 * @property {() => void} onClose - Callback-Funktion, um das Modal zu schließen.
 * @property {(FunctionInfo: FunctionUser) => void} refetch - Callback-Funktion, um die Liste der Benutzer zu aktualisieren.
 * @property {FunctionUser | undefined} selectedFunction - Die aktuell ausgewählte Funktion.
 * @property {boolean} isSingleUser - Gibt an, ob die Funktion nur einen Benutzer zulässt.
 */
interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  refetch: (FunctionInfo: FunctionUser) => void;
  selectedFunction: FunctionUser | undefined;
  isSingleUser: boolean;
}

/**
 * `AddUserModal`-Komponente
 *
 * Diese Komponente zeigt ein Modal zur Auswahl und Hinzufügung eines Benutzers zu einer Funktion.
 * Bei Funktionen, die nur einen Benutzer zulassen, wird eine Bestätigung zum Ersetzen des aktuellen Benutzers angezeigt.
 *
 * @component
 * @param {AddUserModalProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <AddUserModal
 *   open={true}
 *   onClose={() => console.log('Modal schließen')}
 *   refetch={(newData) => console.log('Liste aktualisieren', newData)}
 *   selectedFunction={selectedFunction}
 *   isSingleUser={false}
 * />
 */
const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  refetch,
  selectedFunction,
  isSingleUser,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [userIds, setUserIds] = useState<ShortUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [displayFormat, setDisplayFormat] = useState<'userId' | 'nameOnly'>(
    'userId',
  ); // Zustand für die Anzeige

  /**
   * Lädt die Liste der Benutzer-IDs basierend auf dem Anzeigeformat.
   *
   * @function fetchUsers
   * @async
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Mappe displayFormat zu den unterstützten Werten für fetchEmployees
      const fetchFormat = displayFormat === 'nameOnly' ? 'lastName' : 'userId';
      const fetchedUserIds: ShortUser[] = await fetchUserIds(fetchFormat);
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
  }, [displayFormat]);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, fetchUsers]);

  /**
   * Validiert die Benutzer-ID und setzt entsprechende Fehlermeldungen.
   *
   * @function validateInput
   * @returns {boolean} Gibt `true` zurück, wenn die Eingabe gültig ist.
   */

  const validateInput = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/;

    if (!newUserId.trim()) {
      newErrors.userId = 'Der Benutzer-ID darf nicht leer sein.';
    } else if (!userIdRegex.test(newUserId)) {
      newErrors.userId =
        'Benutzer-ID muss 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Fügt einen neuen Benutzer zu der ausgewählten Funktion hinzu.
   *
   * @function handleAddUser
   * @async
   */
  const handleAddUser = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      console.log('hgfhgfj: ', selectedFunction);
      const newUserList = await addUserToFunction(
        selectedFunction?.functionName ?? '',
        newUserId,
        selectedFunction?._id ?? '',
        selectedFunction?.orgUnit ?? '',
      );
      refetch(newUserList);
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
    }
  };

  /**
   * Öffnet das Bestätigungsmodal für das Ersetzen eines Benutzers.
   *
   * @function handleOpenConfirmModal
   */
  const handleOpenConfirmModal = () => {
    if (validateInput()) {
      setConfirmModalOpen(true);
    }
  };

  /**
   * Bestätigt das Ersetzen eines Benutzers und führt die Hinzufügung durch.
   *
   * @function handleConfirmReplace
   * @async
   */
  const handleConfirmReplace = async () => {
    setConfirmModalOpen(false);
    await handleAddUser();
  };

  /**
   * Wechselt das Anzeigeformat der Benutzerliste zwischen Benutzer-ID und Namen.
   *
   * @function toggleDisplayFormat
   */
  const toggleDisplayFormat = () => {
    setDisplayFormat((prev) => (prev === 'userId' ? 'nameOnly' : 'userId'));
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography variant="h6" textAlign="center" gutterBottom>
            {isSingleUser ? 'Benutzer ersetzen' : 'Benutzer hinzufügen'}
          </Typography>
          <Box display="flex" alignItems="center">
            <Box sx={{ flexGrow: 1 }}>
              <UserAutocomplete
                options={userIds}
                loading={loading}
                value={userIds.find((id) => id.userId === newUserId) || null}
                onChange={(value) => {
                  if (!Array.isArray(value)) {
                    setNewUserId(value?.userId || '');
                  }
                }}
                displayFormat={displayFormat} // Alternativ: "userId" oder "nameOnly" oder "full"
                label={
                  displayFormat === 'userId'
                    ? 'Benutzer ID auswählen'
                    : 'Benutzer Name auswählen'
                } // Dynamisches Label
                placeholder={
                  displayFormat === 'userId'
                    ? 'Benutzer ID auswählen'
                    : 'Benutzer Name auswählen'
                }
                helperText={errors.userId}
              />
            </Box>
            <Box sx={{ flexShrink: 1 }}>
              <IconButton onClick={toggleDisplayFormat}>
                <SwapHoriz />
              </IconButton>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={isSingleUser ? handleOpenConfirmModal : handleAddUser}
              fullWidth
              sx={{ mr: 1 }}
            >
              {isSingleUser ? 'Ersetzen' : 'Hinzufügen'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              fullWidth
              sx={{ ml: 1 }}
            >
              Abbrechen
            </Button>
          </Box>
          {errors.userId && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.userId}
            </Alert>
          )}
        </Box>
      </Modal>

      {/* Bestätigungsmodal */}
      <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography variant="h6" textAlign="center">
            Sind Sie sicher, dass Sie den Benutzer ersetzen möchten?
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmReplace}
              fullWidth
              sx={{ mr: 1 }}
            >
              Ersetzen
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setConfirmModalOpen(false)}
              fullWidth
              sx={{ ml: 1 }}
            >
              Abbrechen
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddUserModal;
