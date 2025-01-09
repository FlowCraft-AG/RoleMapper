/**
 * @file EditFunctionModal.tsx
 * @description Modal-Komponente zum Bearbeiten einer Funktion in einer Organisationseinheit.
 *
 * @module EditFunctionModal
 */

import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchFunctionById,
  updateFunction,
} from '../../../lib/api/function.api';
import { fetchOrgUnitsIds } from '../../../lib/api/orgUnit.api';
import { FunctionString } from '../../../types/function.type';
import { ShortOrgUnit } from '../../../types/orgUnit.type';

/**
 * Props für die `EditFunctionModal`-Komponente.
 *
 * @interface EditFunctionModalProps
 * @property {boolean} open - Gibt an, ob das Modal geöffnet ist.
 * @property {() => void} onClose - Callback-Funktion, um das Modal zu schließen.
 * @property {FunctionString | undefined} functionData - Die zu bearbeitende Funktion.
 * @property {(functionList: FunctionString[]) => void} refetch - Callback zur Aktualisierung der Funktionsliste.
 * @property {(functionId: string) => void} onEdit - Callback nach dem Speichern der Funktion.
 */
interface EditFunctionModalProps {
  open: boolean;
  onClose: () => void;
  functionData: FunctionString | undefined;
  refetch: (functionList: FunctionString[]) => void; // Callback zur Aktualisierung der Funktionliste
  onEdit: (functionId: string) => void;
}

/**
 * `EditFunctionModal`-Komponente
 *
 * Diese Komponente zeigt ein Modal an, mit dem eine Funktion bearbeitet werden kann. Sie ermöglicht es,
 * den Funktionsnamen, die zugehörige Organisationseinheit und die Einstellung "Einzelnutzer" zu bearbeiten.
 *
 * @component
 * @param {EditFunctionModalProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <EditFunctionModal
 *   open={true}
 *   onClose={() => console.log('Modal schließen')}
 *   functionData={{
 *     _id: '123',
 *     functionName: 'Test Funktion',
 *     orgUnit: '456',
 *     isSingleUser: false,
 *   }}
 *   refetch={(newFunctions) => console.log('Liste aktualisieren', newFunctions)}
 *   onEdit={(functionId) => console.log('Bearbeitete Funktion:', functionId)}
 * />
 */

const EditFunctionModal = ({
  open,
  onClose,
  functionData,
  refetch,
  onEdit,
}: EditFunctionModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [formData, setFormData] = useState({
    functionName: functionData?.functionName,
    orgUnitId: functionData?.orgUnit,
    isSingleUser: functionData?.isSingleUser,
  });
  const [orgUnits, setOrgUnits] = useState<ShortOrgUnit[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fehlerbehandlungsfunktion.
   *
   * @function handleError
   * @param {string} message - Fehlermeldung, die angezeigt werden soll.
   * @param {unknown} error - Das Fehlerobjekt.
   */
  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    setSnackbar({
      open: true,
      message: message,
    });
  };

  /**
   * Lädt die aktuellen Daten der Funktion.
   *
   * @function loadFunctionData
   * @async
   */
  const loadFunctionData = useCallback(async () => {
    try {
      const func = await fetchFunctionById(functionData?._id ?? ''); // API-Aufruf zum Laden der Organisationseinheit
      setFormData({
        functionName: func.functionName,
        orgUnitId: func.orgUnit,
        isSingleUser: func.isSingleUser,
      });
    } catch (error) {
      handleError('Fehler beim Laden der Benutzer:', error);
    }
  }, [functionData]); // Die Funktion wird nur beim ersten Laden ausgeführt

  /**
   * Lädt die IDs der Organisationseinheiten.
   *
   * @function fetchOrgUnits
   * @async
   */
  const fetchOrgUnits = useCallback(async () => {
    setLoading(true);
    try {
      const orgUnitsResponse = await fetchOrgUnitsIds(); // Fetch data from the server
      setOrgUnits(orgUnitsResponse);
    } catch (error) {
      console.error('Failed to fetch organization units:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Die Funktion wird nur beim ersten Laden ausgeführt

  // Update state wenn `functionData`  sich ändert
  useEffect(() => {
    if (open && functionData) {
      loadFunctionData();
      fetchOrgUnits();
    }
  }, [open, functionData, loadFunctionData, fetchOrgUnits]);

  /**
   * Validiert den Funktionsnamen.
   *
   * @function validateFunctionName
   * @param {string} name - Der zu validierende Funktionsname.
   * @returns {boolean} Gibt `true` zurück, wenn der Name gültig ist.
   */
  const validateFunctionName = (name: string) => /^[a-zA-Z\s]+$/.test(name);

  /**
   * Speichert die Änderungen der Funktion.
   *
   * @function handleSave
   * @async
   */
  const handleSave = async () => {
    if (!validateFunctionName(formData.functionName!)) {
      console.error('Invalid function name');
      return;
    }

    setIsSaving(true);

    try {
      const updatedFunction: FunctionString[] = await updateFunction({
        functionId: functionData?._id ?? '',
        functionName: formData.functionName ?? '',
        newOrgUnitId: formData.orgUnitId ?? '',
        isSingleUser: formData.isSingleUser ?? false,
        oldFunctionName: functionData?.functionName || '',
        orgUnitId: functionData?.orgUnit || '',
      });
      setSnackbar({
        open: true,
        message: 'Explizite Funktion erfolgreich erstellt.',
      });
      refetch(updatedFunction);
      setIsSaving(false);
      onEdit(functionData?._id || '');
    } catch (error) {
      console.error('Error updating function:', error);
      if (error instanceof Error) {
        setSnackbar({
          open: true,
          message: error.message,
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Fehler beim Speichern der Funktion.',
        });
      }

      setIsSaving(false);
    }
  };

  /**
   * Erzeugt einen anzeigbaren Namen für Organisationseinheiten.
   *
   * @function buildDisplayName
   * @param {ShortOrgUnit} unit - Die Organisationseinheit.
   * @param {Map<string, ShortOrgUnit>} orgUnitsMap - Eine Map aller Organisationseinheiten.
   * @returns {string} Der anzeigbare Name.
   */
  const buildDisplayName = (
    unit: { name: string; parentId?: string },
    orgUnitsMap: Map<string, { name: string; parentId?: string }>,
  ): string => {
    const parent = unit.parentId ? orgUnitsMap.get(unit.parentId) : undefined;
    const grandParent = parent?.parentId
      ? orgUnitsMap.get(parent.parentId)
      : undefined;

    // Sonderfall: Wenn der Parent "Hochschule" ist, zeige nur den Namen des Kindes
    if (parent?.name === 'Hochschule') {
      return unit.name;
    }

    // Fall: Es gibt sowohl einen Parent als auch einen Grandparent
    if (parent && grandParent) {
      return `${unit.name} (${grandParent.name}, ${parent.name})`;
    }

    // Fall: Es gibt nur einen Parent
    if (parent) {
      return `${unit.name} (${parent.name})`;
    }

    // Fallback: Nur der Name des aktuellen Knotens
    return unit.name;
  };

  // Optionen für Autocomplete generieren
  const options = orgUnits.map((unit) => ({
    ...unit,
    displayName: buildDisplayName(
      unit,
      new Map(orgUnits.map((u) => [u._id, u])),
    ),
  }));

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
          <Typography variant="h6">Funktion bearbeiten</Typography>
          <TextField
            label="Funktionsname"
            value={formData.functionName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, functionName: e.target.value }))
            }
            fullWidth
            margin="normal"
          />
          <Autocomplete
            options={options}
            loading={loading}
            getOptionLabel={(option) => {
              // Überprüfen, ob der Name verfügbar ist
              if (!option.name) {
                console.error('Option hat keinen Namen:', option);
                return 'Unbenannt';
              }
              return option.name; // Rein und ohne Seiteneffekte
            }}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                {option.displayName}
              </li>
            )}
            value={options.find((ou) => ou._id === formData.orgUnitId) || null}
            onChange={(_, newValue) =>
              setFormData((prev) => ({
                ...prev,
                orgUnitId: newValue?._id || '',
              }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Organisationseinheit" />
            )}
          />

          {!functionData?.isImpliciteFunction && (
            <>
              <Typography>Einzelnutzer?</Typography>
              <RadioGroup
                row
                value={formData.isSingleUser ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isSingleUser: e.target.value === 'true',
                  }))
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Ja"
                  disabled={
                    functionData?.users && functionData.users.length > 1
                  } // Deaktiviert, wenn mehr als ein Benutzer zugewiesen ist
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Nein"
                />
              </RadioGroup>
              {functionData?.users &&
                functionData.users.length > 1 &&
                formData.isSingleUser && (
                  <Typography variant="caption" color="error">
                    Die Option &quot;Einzelnutzer&quot; kann nicht aktiviert
                    werden, da mehrere Benutzer zugewiesen sind.
                  </Typography>
                )}
            </>
          )}

          <Box sx={{ mt: 2 }}>
            <Tooltip title="Funktion speichern">
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Speichern...' : 'Speichern'}
              </Button>
            </Tooltip>
            <Tooltip title="Abbrechen">
              <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>
                Abbrechen
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditFunctionModal;
