'use client';

import { Add, Delete, Edit } from '@mui/icons-material';
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
import { useCallback, useEffect, useState } from 'react';
import {
  fetchFunctionsByOrgUnit,
  removeFunction,
} from '../../app/organisationseinheiten/fetchkp';
import theme from '../../theme';
import { Function, FunctionInfo } from '../../types/function.type';
import { OrgUnitDTO } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';
import EditFunctionModal from '../modal/EditFunctionModal';
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
  const [functions, setFunctions] = useState<Function[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openSelectType, setOpenSelectType] = useState(false);
  const [openImplicitFunction, setOpenImplicitFunction] = useState(false);
  const [openExplicitFunction, setOpenExplicitFunction] = useState(false);

  const [openEditFunction, setOpenEditFunction] = useState(false); // State für Edit Modal
  const [currentFunction, setCurrentFunction] = useState<Function | undefined>(
    undefined,
  ); // Funktion, die bearbeitet wird

  const loadFunctions = useCallback(async (orgUnitId: string) => {
    try {
      setLoading(true);
      const functionList = await fetchFunctionsByOrgUnit(orgUnitId);
      console.log('Functions:', functionList);
      setFunctions(functionList);
    } catch (err) {
      setError('Fehler beim Laden der Funktionen.');
    } finally {
      setLoading(false);
    }
  }, []); // Die Funktion wird nur beim ersten Laden ausgeführt

  const refetch = (functionList: Function[]) => {
    console.log('Refetching Functions');
    setFunctions(functionList);
  };

  useEffect(() => {
    console.log('FunctionsSpalte: useEffect');
    console.log('orgUnit:', orgUnit);
    if (orgUnit && orgUnit.id) {
      loadFunctions(orgUnit.id); // Hier wird `orgUnit.id` als Parameter übergeben
    }
  }, [orgUnit, loadFunctions]); // Reagiert auf Änderungen der `orgUnit.id`
  // Der Effekt wird nur beim ersten Laden der Komponente ausgeführt.

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Fehler: {error}</Alert>
      </Box>
    );

  // Funktionen filtern
  const filteredFunctions: Function[] =
    functions.filter((func: Function) => func.orgUnit === orgUnit.id) || [];

  if (functions.length === 0 && orgUnit.hasMitglieder === undefined)
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Keine Funktionen verfügbar</Alert>
      </Box>
    );

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
    const success = await removeFunction(func._id); // Serverseitige Funktion aufrufen
    if (success) {
      setFunctions((prev) => prev.filter((f) => f._id !== func._id)); // Update den lokalen Zustand
      onRemove('', func._id);
    } else {
      setError('Fehler beim Entfernen der Funktion.');
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
    if (type === 'implizierte') {
      setOpenImplicitFunction(true);
    } else {
      setOpenExplicitFunction(true);
    }
    setOpenSelectType(false);
  };

  const handleBackToSelectType = () => {
    setOpenSelectType(true);
    setOpenImplicitFunction(false);
    setOpenExplicitFunction(false);
  };

  const handleEditFunction = (func: Function) => {
    setCurrentFunction(func);
    setOpenEditFunction(true); // Öffne das Edit-Modal
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
            <Tooltip title="Bearbeiten">
              <IconButton
                edge="end"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditFunction(func);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>

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
        orgUnitId={orgUnit.id}
        refetch={refetch}
        onBack={handleBackToSelectType}
      />
      <ExplicitFunctionModal
        open={openExplicitFunction}
        onClose={() => setOpenExplicitFunction(false)}
        onBack={handleBackToSelectType}
        orgUnitId={orgUnit.id}
        refetch={refetch}
      />

      <EditFunctionModal
        open={openEditFunction}
        onClose={() => setOpenEditFunction(false)}
        functionData={currentFunction}
        refetch={refetch}
      />
    </Box>
  );
}
