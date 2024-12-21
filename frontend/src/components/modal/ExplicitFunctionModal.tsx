'use client';

import { useMutation, useQuery } from '@apollo/client';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  darken,
  FormControlLabel,
  lighten,
  Modal,
  Radio,
  RadioGroup,
  Snackbar,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { Fragment, useState } from 'react';
import * as createFunction from '../../graphql/mutations/create-function';
import { USER_IDS } from '../../graphql/queries/get-users';
import { User } from '../../types/user.type';
import client from '../../lib/apolloClient';

interface ExplicitFunctionModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  orgUnit: string;
  refetch: () => void;
}

const ExplicitFunctionModal = ({
  open,
  onClose,
  onBack,
  orgUnit,
  refetch,
}: ExplicitFunctionModalProps) => {
  const [functionName, setFunctionName] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSingleUser, setIsSingleUser] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [addUserToFunction] = useMutation(createFunction.CREATE_EXPLICITE_FUNCTIONS, {
    client,
  });

  const { loading, error, data } = useQuery(USER_IDS, {
    client,
  });

  // Prepare options and group them by first letter
  const options = data?.getData.data.map((user: User) => user.userId) || [];

  const groupedOptions = options.reduce((acc: any, userId) => {
    const firstLetter = userId[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(userId);
    return acc;
  }, {});

  const validateInput = () => {
    const newErrors: { [key: string]: string | null } = {};
    const functionNameRegex = /^[a-zA-Z ]+$/; // Funktionsname kann Leerzeichen enthalten, aber keine Sonderzeichen
    const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/; // 4 Buchstaben + 4 Zahlen

    if (!functionName.trim()) {
      newErrors.functionName = 'Funktionsname darf nicht leer sein.';
    }

    if (!functionNameRegex.test(functionName)) {
      newErrors.functionName =
        'Funktionsname darf nur Buchstaben und Leerzeichen enthalten.';
    }
      console.log('users:', users);

    if (users.some((user) => !userIdRegex.test(user))) {
      newErrors.users =
        'Benutzer müssen 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateInput()) {
      try {
        await addUserToFunction({
          variables: {
            functionName,
            orgUnit,
            users,
            isSingleUser,
          },
        });
        refetch(); // Aktualisiere die Daten nach der Mutation
        setSnackbar({
          open: true,
          message: 'Explizierte Funktion erfolgreich erstellt.',
        });
      } catch (err) {
        console.error('Fehler beim Hinzufügen des Benutzers:', err);
        setSnackbar({
          open: true,
          message: 'Fehler beim Hinzufügen des Benutzers.',
        });
      }
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
                label="Benutzer (Kommagetrennt)"
                placeholder="Benutzer-ID eingeben"
                error={!!errors.users}
                helperText={errors.users}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  },
                }}
              />
            )}
            multiple
            freeSolo
            value={users}
            onChange={(_, value) => setUsers(value)}
            renderOption={(props, option, { inputValue }) => {
              const matches = match(option, inputValue, { insideWords: true });
              const parts = parse(option, matches);

              return (
                <li {...props}>
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
    </>
  );
};

export default ExplicitFunctionModal;
