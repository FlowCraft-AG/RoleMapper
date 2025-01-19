/**
 * Stellt die Spalte für Funktionen innerhalb einer Organisationseinheit dar.
 * Diese Komponente zeigt Funktionen an, ermöglicht die Verwaltung von Funktionen und bietet Modals für verschiedene Aktionen.
 *
 * @module FunctionsSpalte
 */

'use client';

import {
  Add,
  Delete,
  DynamicFeed,
  Edit,
  Group,
  Person,
} from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  useTheme,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchFunctionById,
  fetchFunctionsByOrgUnit,
  removeFunction,
} from '../../lib/api/rolemapper/function.api';
import { FunctionString } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { getListItemStyles } from '../../utils/styles';
import EditFunctionModal from '../modal/functionModals/EditFunctionModal';
import ExplicitFunctionModal from '../modal/functionModals/ExplicitFunctionModal';
import ImplicitFunctionModal from '../modal/functionModals/ImplicitFunctionModal';
import SelectFunctionTypeModal from '../modal/functionModals/SelectFunctionTypeModal';

/**
 * Props für die `FunctionsSpalte`-Komponente.
 *
 * @interface FunctionsColumnProps
 * @property {OrgUnit} orgUnit - Die Organisationseinheit, zu der die Funktionen gehören.
 * @property {OrgUnit | undefined} rootOrgUnit - Die übergeordnete Organisationseinheit (falls vorhanden).
 * @property {FunctionString[]} [functions] - Die Liste der Funktionen, die optional übergeben werden kann.
 * @property {function} onSelect - Callback-Funktion, die aufgerufen wird, wenn eine Funktion ausgewählt wird.
 * @property {function} handleMitgliederClick - Callback-Funktion, um Mitglieder anzuzeigen.
 * @property {function} onRemove - Callback-Funktion, die aufgerufen wird, wenn Funktionen entfernt werden.
 */
interface FunctionsColumnProps {
  orgUnit: OrgUnit;
  rootOrgUnit: OrgUnit | undefined;
  functions?: FunctionString[]; // Alle Funktionen, zentral von `page.tsx` übergeben
  onSelect: (func: FunctionString) => void;
  handleMitgliederClick: () => void;
  onRemove: (ids: string[]) => void; // Übergibt ein Array von IDs
}

/**
 * `FunctionsSpalte` zeigt alle Funktionen einer Organisationseinheit an und bietet Verwaltungsoptionen.
 *
 * - Funktionen können hinzugefügt, bearbeitet und entfernt werden.
 * - Unterstützt implizite und explizite Funktionen sowie Modals für spezifische Aktionen.
 *
 * @component
 * @param {FunctionsColumnProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Funktionen-Spalte.
 *
 * @example
 * <FunctionsSpalte
 *   orgUnit={selectedOrgUnit}
 *   rootOrgUnit={rootOrgUnit}
 *   onSelect={(func) => console.log(func)}
 *   handleMitgliederClick={() => console.log('Mitglieder anzeigen')}
 *   onRemove={(ids) => console.log('Entfernte IDs:', ids)}
 * />
 */
export default function FunctionsSpalte({
  orgUnit,
  rootOrgUnit,
  onSelect,
  handleMitgliederClick,
  onRemove,
}: FunctionsColumnProps) {
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  //const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen
  const [functions, setFunctions] = useState<FunctionString[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [openSelectType, setOpenSelectType] = useState(false);
  const [openImplicitFunction, setOpenImplicitFunction] = useState(false);
  const [openExplicitFunction, setOpenExplicitFunction] = useState(false);

  const [openEditFunction, setOpenEditFunction] = useState(false); // State für Edit Modal
  const [currentFunction, setCurrentFunction] = useState<
    FunctionString | undefined
  >(undefined); // Funktion, die bearbeitet wird

  /**
   * Lädt alle Funktionen einer Organisationseinheit.
   *
   * @async
   * @function loadFunctions
   * @param {string} orgUnitId - Die ID der Organisationseinheit.
   * @returns {Promise<void>}
   */
  const loadFunctions = useCallback(async (orgUnitId: string) => {
    try {
      setLoading(true);
      const functionList = await fetchFunctionsByOrgUnit(orgUnitId);
      setFunctions(functionList);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ein unbekannter Fehler ist aufgetreten.');
      }
    } finally {
      setLoading(false);
    }
  }, []); // Die Funktion wird nur beim ersten Laden ausgeführt

  /**
   * Aktualisiert die Liste der Funktionen.
   *
   * @function refetch
   * @param {FunctionString[]} functionList - Die aktualisierte Liste der Funktionen.
   */
  const refetch = (functionList: FunctionString[]) => {
    setFunctions(functionList);
  };

  useEffect(() => {
    if (orgUnit && orgUnit._id) {
      loadFunctions(orgUnit._id); // Hier wird `orgUnit.id` als Parameter übergeben
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
  //   const filteredFunctions: Function[] =
  //     functions.filter((func: Function) => func.orgUnit === orgUnit._id) || [];

  // Klick-Handler für eine Funktion oder "Mitglieder"
  const handleClick = async (func: FunctionString | string) => {
    if (typeof func === 'string') {
      setSelectedIndex(func);
      handleMitgliederClick();
    } else {
      setSelectedIndex(func._id);
      const func2: FunctionString = await fetchFunctionById(func._id);
      onSelect(func2);
    }
  };

  /**
   * Handhabt das Entfernen einer Funktion.
   *
   * @async
   * @function handleRemoveFunction
   * @param {FunctionString} func - Die zu entfernende Funktion.
   * @returns {Promise<void>}
   */
  const handleRemoveFunction = async (func: FunctionString) => {
    const success = await removeFunction(func._id, func.orgUnit); // Serverseitige Funktion aufrufen
    if (success) {
      setFunctions((prev) => prev.filter((f) => f._id !== func._id)); // Update den lokalen Zustand
      onRemove([func._id]); // Übergebe die ID an `onRemove`
    } else {
      setError('Fehler beim Entfernen der Funktion.');
    }
  };

  const handleViewUser = (func: FunctionString) => {
    setSelectedIndex(func._id);
    handleClick(func);
  };

  /**
   * Handhabt das Hinzufügen einer neuen Funktion.
   */
  const handleAddFunctionClick = () => {
    setOpenSelectType(true);
  };

  /**
   * Handhabt die Auswahl eines Funktionstyps (implizit/explizit).
   *
   * @function handleSelectFunctionType
   * @param {string} type - Der Typ der Funktion.
   */
  const handleSelectFunctionType = (type: string) => {
    if (type === 'implizite') {
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

  /**
   * Handhabt das Bearbeiten einer Funktion.
   *
   * @async
   * @function handleEditFunction
   * @param {FunctionString} func - Die zu bearbeitende Funktion.
   */
  const handleEditFunction = async (func: FunctionString) => {
    const func2 = await fetchFunctionById(func._id); // API-Aufruf zum Laden der Organisationseinheit
    setCurrentFunction(func2);
    setOpenEditFunction(true); // Öffne das Edit-Modal
  };

  const onEdit = (functionId: string) => {
    setOpenEditFunction(false);
    onRemove([functionId]); // Entferne die alte Funktion
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
            <Tooltip title={'Mitglieder im ' + rootOrgUnit.name}>
              <Box display="flex" alignItems="center">
                {/*Das DynamicFeed-Icon, das dynamische, abgeleitete Gruppen repräsentiert.*/}
                <DynamicFeed sx={{ marginRight: 1 }} color="action" />
              </Box>
            </Tooltip>
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

      {functions.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Alert severity="info">Keine Funktionen verfügbar</Alert>
        </Box>
      )}

      <List>
        {functions.map((func) => (
          <ListItemButton
            key={func._id} // Eindeutiger Schlüssel für jedes Element
            selected={selectedIndex === func._id}
            onClick={() => handleViewUser(func)}
            sx={getListItemStyles(theme, selectedIndex === func._id)}
          >
            {/* Icon abhängig von implizit/explizit und Einzelperson/Mehrpersonen */}
            {/* Icon abhängig vom Funktionstyp */}
            <Tooltip
              title={`${
                func.isImpliciteFunction
                  ? 'Implizite Funktion'
                  : 'Explizite Funktion'
              } - ${
                func.isImpliciteFunction
                  ? 'Mehrere Personen belegen diese Funktion'
                  : func.isSingleUser
                    ? 'Nur eine Person kann diese Funktion belegen'
                    : 'Mehrere Personen können diese Funktion belegen'
              }`}
            >
              {/* Icon abhängig vom Funktionstyp */}
              {/*Das DynamicFeed-Icon, das dynamische, abgeleitete Gruppen repräsentiert.*/}
              {/*Das Person-Icon repräsentiert eine einzelne Person.*/}
              {/*Das Group-Icon repräsentiert eine Gruppe von Personen.*/}
              {func.isImpliciteFunction ? (
                <DynamicFeed sx={{ marginRight: 1 }} color="action" /> // Icon für implizite Funktionen
              ) : func.isSingleUser ? (
                <Person sx={{ marginRight: 1 }} color="action" /> // Icon für Einzelperson
              ) : (
                <Group sx={{ marginRight: 1 }} color="action" /> // Icon für Gruppen
              )}
            </Tooltip>

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
        orgUnitId={orgUnit._id}
        refetch={refetch}
        onBack={handleBackToSelectType}
      />
      <ExplicitFunctionModal
        open={openExplicitFunction}
        onClose={() => setOpenExplicitFunction(false)}
        onBack={handleBackToSelectType}
        orgUnitId={orgUnit._id}
        refetch={refetch}
      />

      <EditFunctionModal
        open={openEditFunction}
        onClose={() => setOpenEditFunction(false)}
        onEdit={onEdit}
        functionData={currentFunction}
        refetch={refetch}
      />
    </Box>
  );
}
