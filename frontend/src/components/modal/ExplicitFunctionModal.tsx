import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface ExplicitFunctionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (functionName: string, users: string[]) => void;
  onBack: () => void;
}

const ExplicitFunctionModal = ({
  open,
  onClose,
  onSave,
  onBack,
}: ExplicitFunctionModalProps) => {
  const [functionName, setFunctionName] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSingleUser, setIsSingleUser] = useState<boolean>(false); 

  const handleUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsers(value.split(',').map((user) => user.trim()));
  };

  const validateInput = () => {
    const newErrors: { [key: string]: string | null } = {};
    const functionNameRegex = /^[a-zA-Z]+$/; // Nur Buchstaben
    const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/; // 4 Buchstaben + 4 Zahlen

    if (!functionName.trim()) {
      newErrors.functionName = 'Funktionsname darf nicht leer sein.';
    }

    if (!functionNameRegex.test(functionName)) {
      newErrors.functionName = 'Funktionsname darf nur Buchstaben enthalten.';
    }

    if (users.some((user) => !userIdRegex.test(user))) {
      newErrors.users =
        'Benutzer müssen 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateInput()) {
      onSave(functionName, users, isSingleUser);
      resetFields(); // Eingabefelder zurücksetzen
      onClose();
    }
  };

  const resetFields = () => {
    setFunctionName('');
    setUsers([]);
    setErrors({});
    setIsSingleUser(false); // Zustand für den RadioButton zurücksetzen
  };

  return (
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
        <Typography variant="h6">Explizite Funktion</Typography>
        <TextField
          label="Funktionsname"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          fullWidth
          error={!!errors.functionName}
          helperText={errors.functionName}
        />

        <TextField
          label="Benutzer (Kommagetrennt)"
          value={users.join(', ')}
          onChange={handleUsersChange}
          fullWidth
          error={!!errors.users}
          helperText={errors.users}
        />

        {/* Neue RadioGroup für die Auswahl, ob es nur ein Benutzer oder mehrere sein können */}
        <Typography variant="body1">
          Kann diese Funktion nur von einem Benutzer besetzt werden?
        </Typography>
        <RadioGroup
          row
          value={isSingleUser ? 'true' : 'false'}
          onChange={(e) => setIsSingleUser(e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Ja" />
          <FormControlLabel value="false" control={<Radio />} label="Nein" />
        </RadioGroup>

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
            resetFields();
            onBack();
          }}
        >
          Zurück
        </Button>
      </Box>
    </Modal>
  );
};

export default ExplicitFunctionModal;
