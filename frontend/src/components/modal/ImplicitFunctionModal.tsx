import { useMutation } from '@apollo/client';
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
import { CREATE_IMPLICITE_FUNCTIONS } from '../../graphql/mutations/create-function';
import client from '../../lib/apolloClient';
import { getEnumValues } from '../../types/user.type';

interface ImplicitFunctionModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  orgUnitId: string;
  refetch: () => void;
}

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
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [createFunction] = useMutation(CREATE_IMPLICITE_FUNCTIONS, { client });

  // Extrahieren der Enum-Werte des UserAttributes
  const availableFields = getEnumValues(); // Hier erhalten wir alle Attributnamen des Enums

  const resetFields = () => {
    setFunctionName('');
    setField('');
    setValue('');
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors: { [key: string]: string | null } = {};
    const functionNameRegex = /^[a-zA-Z\s]+$/; // Nur Buchstaben und Leerzeichen erlaubt

    if (!functionName.trim()) {
      newErrors.functionName = 'Funktionsname darf nicht leer sein.';
    }

    if (!functionNameRegex.test(functionName)) {
      newErrors.functionName =
        'Funktionsname darf nur Buchstaben und Leerzeichen enthalten.';
    }

    if (!field.trim()) {
      newErrors.field = 'Attribut muss ausgewählt sein.';
    }

    if (!value) {
      newErrors.value = 'wert darf nicht leer sein!.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        await createFunction({
          variables: {
            functionName,
            field,
            value,
            orgUnitId,
          },
        });
        refetch(); // Aktualisiere die Daten nach der Mutation
        setSnackbar({
          open: true,
          message: 'Implizierte Funktion erfolgreich erstellt.',
        });

        resetFields(); // Eingabefelder zurücksetzen
        onClose();
      } catch (err) {
        console.error('Fehler beim Hinzufügen des Benutzers:', err);
        setSnackbar({
          open: true,
          message: 'Fehler beim Hinzufügen des Benutzers:',
        });
      }
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
