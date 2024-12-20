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
  Tooltip,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { DELETE_FUNCTIONS } from '../../graphql/mutations/delete-function';
import { FUNCTIONS_BY_ORG_UNIT } from '../../graphql/queries/get-functions';
import client from '../../lib/apolloClient';
import theme from '../../theme';
import { Function, FunctionInfo } from '../../types/function.type';
import { OrgUnitDTO } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';
import ExplicitFunctionModal from '../modal/ExplicitFunctionModal';
import ImplicitFunctionModal from '../modal/ImplicitFunctionModal';
import SelectFunctionTypeModal from '../modal/SelectFunctionTypeModal';

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

  const [openSelectType, setOpenSelectType] = useState(false);
  const [openImplicitFunction, setOpenImplicitFunction] = useState(false);
  const [openExplicitFunction, setOpenExplicitFunction] = useState(false);
  const [users, setUsers] = useState(['user1', 'user2']); // Diese Liste könnte von der GraphQL-Query kommen
  const [selectedType, setSelectedType] = useState<string>('');

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

  const handleAddFunctionClick = () => {
    setOpenSelectType(true);
  };

  const handleSelectFunctionType = (type: string) => {
    setSelectedType(type);
    if (type === 'implizierte') {
      setOpenImplicitFunction(true);
    } else {
      setOpenExplicitFunction(true);
    }
    setOpenSelectType(false);
  };

  const handleSaveImplicitFunction = async (
    attribute: string,
    userId: string,
  ) => {
    console.log('Attribut:', attribute);
    console.log('Benutzer:', userId);
    // Speichern der implizierten Funktion
    setOpenImplicitFunction(false);
  };

  const handleBackToSelectType = () => {
    setOpenSelectType(true);
    setOpenImplicitFunction(false);
    setOpenExplicitFunction(false);
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
          onClick={handleAddFunctionClick}
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
            key={func._id} // Eindeutiger Schlüssel für jedes Element
            selected={selectedIndex === func._id}
            onClick={() => handleViewUser(func)}
            sx={getListItemStyles(theme, selectedIndex === func._id)}
          >
            <ListItemText primary={func.functionName} />
            <Tooltip title="Benutzer entfernen">
              <IconButton
                edge="end"
                color="error"
                onClick={(e) => {
                  e.stopPropagation(); // Blockiere Event nur für den Button
                  handleRemoveFunction(func);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </ListItemButton>
        ))}
      </List>

      {/* Modal für Funktionen hinzufügen */}
      {/* Modals */}
      <SelectFunctionTypeModal
        open={openSelectType}
        onClose={() => setOpenSelectType(false)}
        onSelectType={handleSelectFunctionType}
      />
      <ImplicitFunctionModal
        open={openImplicitFunction}
        onClose={() => setOpenImplicitFunction(false)}
        onSave={handleSaveImplicitFunction}
        onBack={handleBackToSelectType}
      />
      <ExplicitFunctionModal
        open={openExplicitFunction}
        onClose={() => setOpenExplicitFunction(false)}
        onBack={handleBackToSelectType}
        orgUnit={orgUnit.id}
        refetch={refetch}
      />
    </Box>
  );
}
