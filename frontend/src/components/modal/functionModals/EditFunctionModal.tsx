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
import { useEffect, useState } from 'react';
import { updateFunction } from '../../../lib/api/function.api';
import { fetchOrgUnitsIds } from '../../../lib/api/orgUnit.api';
import { Function } from '../../../types/function.type';
import { ShortOrgUnit } from '../../../types/orgUnit.type';

interface EditFunctionModalProps {
  open: boolean;
  onClose: () => void;
  functionData: Function | undefined;
  refetch: (functionList: Function[]) => void; // Callback zur Aktualisierung der Funktionliste
  onEdit: (functionId: string) => void;
}

const EditFunctionModal = ({
  open,
  onClose,
  functionData,
  refetch,
  onEdit,
}: EditFunctionModalProps) => {
  console.log('EDIT FUNCTION MODAL');
  console.log('selectedFunction:', functionData);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [formData, setFormData] = useState({
    functionName: functionData?.functionName,
    orgUnitId: functionData?.orgUnit,
    isSingleUser: functionData?.isSingleUser,
  });
  const [orgUnits, setOrgUnits] = useState<ShortOrgUnit[]>([]);
  const [loading, setLoading] = useState(false);

  // Update state wenn `functionData`  sich ändert
  useEffect(() => {
    if (open && functionData) {
      setFormData({
        functionName: functionData.functionName,
        orgUnitId: functionData.orgUnit,
        isSingleUser: functionData.isSingleUser,
      });
      // Fetch org units only when modal opens
      fetchOrgUnits();
    }
  }, [open, functionData]);

  const fetchOrgUnits = async () => {
    setLoading(true);
    try {
      const orgUnitsResponse = await fetchOrgUnitsIds(); // Fetch data from the server
      setOrgUnits(orgUnitsResponse);
    } catch (error) {
      console.error('Failed to fetch organization units:', error);
    } finally {
      setLoading(false);
    }
  };

  //   const orgUnitsMap = new Map(
  //     orgUnits.map((unit: ShortOrgUnit | undefined) => [unit?._id, unit?.name]),
  //   );

  const validateFunctionName = (name: string) => /^[a-zA-Z\s]+$/.test(name);

  const handleSave = async () => {
    if (!validateFunctionName(formData.functionName!)) {
      console.error('Invalid function name');
      return;
    }

    setIsSaving(true);

    try {
      const updatedFunction: Function[] = await updateFunction({
        functionName: formData.functionName!,
        newOrgUnitId: formData.orgUnitId!,
        isSingleUser: formData.isSingleUser!,
        oldFunctionName: functionData?.functionName || '',
        orgUnitId: functionData?.orgUnit || '',
      });
      setSnackbar({
        open: true,
        message: 'Explizierte Funktion erfolgreich erstellt.',
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

  const buildDisplayName = (
    unit: { name: string; parentId?: string },
    orgUnitsMap: Map<string, { name: string; parentId?: string }>,
  ): string => {
    const parent = unit.parentId ? orgUnitsMap.get(unit.parentId) : null;
    const grandParent = parent?.parentId
      ? orgUnitsMap.get(parent.parentId)
      : null;

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

  //   const options = orgUnits.map(
  //     (unit: { _id: string; name: string; parentId?: string }) => ({
  //       ...unit,
  //       displayName: `${unit.name} (${orgUnitsMap.get(unit?.parentId)})`,
  //     }),
  //   );

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
            <FormControlLabel value="true" control={<Radio />} label="Ja" />
            <FormControlLabel value="false" control={<Radio />} label="Nein" />
          </RadioGroup>
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
