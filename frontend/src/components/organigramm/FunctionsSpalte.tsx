'use client';

import { useMutation, useQuery } from '@apollo/client';
import { Add, Delete } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  TextField,
  Tooltip,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { CREATE_FUNCTIONS } from '../../graphql/mutations/create-function';
import { DELETE_FUNCTIONS } from '../../graphql/mutations/delete-function';
import { FUNCTIONS_BY_ORG_UNIT } from '../../graphql/queries/get-functions';
import client from '../../lib/apolloClient';
import theme from '../../theme';
import { Function, FunctionInfo } from '../../types/function.type';
import { OrgUnitDTO } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';

interface FunctionsColumnProps {
  orgUnit: OrgUnitDTO;
  rootOrgUnit: OrgUnitDTO | undefined;
  functions?: Function[]; // Alle Funktionen, zentral von `page.tsx` übergeben
  onSelect: (functionInfo: FunctionInfo) => void;
  handleMitgliederClick: () => void;
  onRemove: (userId: string, functionId: string) => void;
}

export default function FunctionsSpalte({
  orgUnit,
  rootOrgUnit,
  onSelect,
  handleMitgliederClick,
  onRemove,
}: FunctionsColumnProps) {
  const [selectedIndex, setSelectedIndex] = useState<string | undefined>(
    undefined,
  );
  const [addUserToFunction] = useMutation(CREATE_FUNCTIONS, { client });
  const [removeUserFromFunction] = useMutation(DELETE_FUNCTIONS, { client });
  const [open, setOpen] = useState(false);
  const [newFunctionData, setNewFunctionData] = useState({
    functionName: '',
    users: [] as string[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const { data, loading, error, refetch } = useQuery(FUNCTIONS_BY_ORG_UNIT, {
    client,
  });

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

  const functions: Function[] = data.getData.data;
  // Funktionen filtern
  const filteredFunctions: Function[] =
    functions.filter((func: Function) => func.orgUnit === orgUnit.id) || [];

  if (functions.length === 0 && orgUnit.hasMitglieder === undefined)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Keine Funktionen verfügbar</Alert>
      </Box>
    );

  const validateInput = () => {
    const newErrors: { [key: string]: string | null } = {};
    const functionNameRegex = /^[a-zA-Z]+$/; // Nur Buchstaben
    const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/; // 4 Buchstaben + 4 Zahlen

    if (!newFunctionData.functionName.trim()) {
      newErrors.functionName = 'Der Funktionsname darf nicht leer sein.';
    }

    if (!functionNameRegex.test(newFunctionData.functionName)) {
      newErrors.functionName =
        'Der Funktionsname darf nur Buchstaben enthalten.';
    }

    // Validierung für `users`
    if (newFunctionData.users.some((user) => !userIdRegex.test(user))) {
      newErrors.users =
        'Benutzernamen müssen 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setNewFunctionData((prev) => ({ ...prev, [field]: value }));
  };

  // Klick-Handler für eine Funktion oder "Mitglieder"
  const handleClick = (func: Function | string) => {
    if (typeof func === 'string') {
      setSelectedIndex(func);
      handleMitgliederClick();
    } else {
      setSelectedIndex(func._id);
      onSelect(func);
    }
  };

  const handleAddFunction = async () => {
    if (!validateInput()) {
      return;
    }

    console.log('orgUnit', orgUnit);
    try {
      await addUserToFunction({
        variables: {
          functionName: newFunctionData.functionName,
          orgUnit: orgUnit.id,
          users: newFunctionData.users,
        },
      });
      refetch(); // Aktualisiere die Daten nach der Mutation
      setNewFunctionData({
        functionName: '',
        users: [],
      });
      setOpen(false);
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Benutzers:', err);
    }
  };

  const handleRemoveFunction = async (func: Function) => {
    try {
      await removeUserFromFunction({
        variables: {
          functionName: func.functionName,
        },
      });
      refetch();
      onRemove('', func._id);
    } catch (err) {
      console.error('Fehler beim Entfernen des Benutzers:', err);
    }
  };

  const handleViewUser = (func: Function) => {
    setSelectedIndex(func._id);
    handleClick(func);
  };

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
          Funktion hinzufügen
        </Button>
      </Box>
      {rootOrgUnit && rootOrgUnit.hasMitglieder && (
        <List>
          <ListItemButton
            key={`mitglieder_${rootOrgUnit.name}`}
            selected={selectedIndex === `mitglieder_${rootOrgUnit.name}`}
            onClick={() => handleClick(`mitglieder_${rootOrgUnit.name}`)}
            aria-selected={selectedIndex === `mitglieder_${rootOrgUnit.name}`}
            sx={getListItemStyles(
              theme,
              selectedIndex === `mitglieder_${rootOrgUnit.name}`,
            )}
          >
            <ListItemText
              primary={
                rootOrgUnit.name === 'Rektorat'
                  ? `Mitglieder im ${rootOrgUnit.name}`
                  : `Alle Benutzer der${rootOrgUnit.type ? ` ${rootOrgUnit.type}` : ''} ${rootOrgUnit.name}`
              }
            />
          </ListItemButton>
        </List>
      )}
      <List>
        {filteredFunctions.map((func) => (
          <ListItemButton
            selected={selectedIndex === func._id}
            onClick={() => handleViewUser(func)}
            sx={getListItemStyles(theme, selectedIndex === func._id)}
          >
            <ListItemText primary={func.functionName} />
            <Tooltip title="Benutzer entfernen">
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleRemoveFunction(func)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </ListItemButton>
        ))}
      </List>

      {/* Modal für Funktionen hinzufügen */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            error={!!errors.functionName}
            helperText={errors.functionName}
            label="Funktionsname"
            placeholder="z.B. Studentische Hilfskraft"
            value={newFunctionData.functionName}
            onChange={(e) => handleInputChange('functionName', e.target.value)}
          />
          <TextField
            fullWidth
            error={!!errors.users}
            helperText={errors.users}
            placeholder="z.B. gyca1011,lufr1012"
            label="Benutzer (Kommagetrennt)"
            value={newFunctionData.users.join(', ')}
            onChange={(e) =>
              handleInputChange(
                'users',
                e.target.value.split(',').map((u) => u.trim()),
              )
            }
          />
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddFunction}
            >
              Hinzufügen
            </Button>
            <Button fullWidth variant="outlined" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
