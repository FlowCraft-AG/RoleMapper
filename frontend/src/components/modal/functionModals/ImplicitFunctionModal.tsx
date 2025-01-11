/**
 * @file ImplicitFunctionModal.tsx
 * @description Modal-Komponente zur Erstellung von implizierten Funktionen in einer Organisationseinheit.
 *
 * @module ImplicitFunctionModal
 */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { createImpliciteFunction } from '../../../lib/api/rolemapper/function.api';
import { FunctionString } from '../../../types/function.type';
import { getEnumValues } from '../../../types/user.type';

/**
 * Props für die `ImplicitFunctionModal`-Komponente.
 *
 * @interface ImplicitFunctionModalProps
 * @property {boolean} open - Gibt an, ob das Modal geöffnet ist.
 * @property {() => void} onClose - Callback-Funktion, um das Modal zu schließen.
 * @property {() => void} onBack - Callback-Funktion, um zur vorherigen Ansicht zurückzukehren.
 * @property {string} orgUnitId - Die ID der Organisationseinheit, zu der die Funktion gehört.
 * @property {(functionList: FunctionString[]) => void} refetch - Callback zur Aktualisierung der Funktionsliste.
 */
interface ImplicitFunctionModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  orgUnitId: string;
  refetch: (functionList: FunctionString[]) => void; // Callback zur Aktualisierung der Funktionliste
}

/**
 * `ImplicitFunctionModal`-Komponente
 *
 * Diese Komponente zeigt ein Modal zur Erstellung von implizierten Funktionen an.
 * Der Benutzer kann einen Funktionsnamen, ein Attribut und einen Wert eingeben.
 *
 * @component
 * @param {ImplicitFunctionModalProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <ImplicitFunctionModal
 *   open={true}
 *   onClose={() => console.log('Modal schließen')}
 *   onBack={() => console.log('Zurück')}
 *   orgUnitId="123"
 *   refetch={(newFunctions) => console.log('Liste aktualisieren', newFunctions)}
 * />
 */
const ImplicitFunctionModal = ({
  open,
  onClose,
  onBack,
  orgUnitId,
  refetch,
}: ImplicitFunctionModalProps) => {
  const [functionName, setFunctionName] = useState('');
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Extrahieren der Enum-Werte des UserAttributes
  const availableFields = getEnumValues(); // Hier erhalten wir alle Attributnamen des Enums

  /**
   * Setzt alle Eingabefelder und Fehlermeldungen zurück.
   *
   * @function resetFields
   */
  const resetFields = () => {
    setFunctionName('');
    setField('');
    setValue('');
    setErrors({});
  };

  /**
   * Validiert die Benutzereingaben und zeigt Fehlermeldungen an, falls erforderlich.
   *
   * @function validateInputs
   * @returns {boolean} Gibt `true` zurück, wenn alle Eingaben gültig sind.
   */
  const validateInputs = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    const functionNameRegex = /^[a-zA-Z\s]+$/; // Nur Buchstaben und Leerzeichen erlaubt

    if (!functionName.trim()) {
      newErrors.functionName = 'Funktionsname darf nicht leer sein.';
    } else if (!functionNameRegex.test(functionName)) {
      newErrors.functionName =
        'Funktionsname darf nur Buchstaben und Leerzeichen enthalten.';
    }

    if (!field.trim()) {
      newErrors.field = 'Attribut muss ausgewählt sein.';
    }

    if (!value.trim()) {
      newErrors.value = 'Wert darf nicht leer sein.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Speichert die neue Funktion, wenn die Eingaben gültig sind.
   *
   * @function handleSave
   * @async
   */
  const handleSave = async () => {
    if (!validateInputs()) return;

    try {
      const newFunction = await createImpliciteFunction({
        functionName,
        orgUnitId,
        field,
        value,
      });
      refetch(newFunction); // Aktualisiere die Liste
      setSnackbar({
        open: true,
        message: 'Implizierte Funktion erfolgreich erstellt.',
      });

      resetFields(); // Eingabefelder zurücksetzen
      onClose();
    } catch (err) {
      console.error('Fehler beim Erstellen der Funktion.', err);
      setSnackbar({
        open: true,
        message: 'Fehler beim Erstellen der Funktion.',
      });
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
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: 400,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6">Implizierte Funktion</Typography>
          <TextField
            label="Funktionsname"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            fullWidth
            error={!!errors.functionName}
            helperText={errors.functionName}
          />

          <FormControl fullWidth>
            <InputLabel id="select-user-label">Attribut</InputLabel>
            <Select
              labelId="select-user-label"
              value={field}
              onChange={(e) => {
                setField(e.target.value);
              }}
              fullWidth
              error={!!errors.value}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300, // Maximale Höhe des Menüs
                    overflowY: 'auto', // Scrollbar für das Menü aktivieren
                  },
                },
              }}
            >
              {availableFields.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="wert"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
          />

          <Button variant="contained" color="primary" onClick={handleSave}>
            Speichern
          </Button>
          <Button
            variant="outlined"
            sx={{ marginTop: 2 }}
            onClick={() => {
              resetFields();
              onClose();
            }}
          >
            Abbrechen
          </Button>
          <Button
            variant="outlined"
            sx={{ marginTop: 2 }}
            onClick={() => {
              onBack();
              resetFields();
            }}
          >
            Zurück
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ImplicitFunctionModal;
