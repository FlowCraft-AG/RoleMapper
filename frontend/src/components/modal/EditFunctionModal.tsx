import { useMutation, useQuery } from '@apollo/client';
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
import { Function } from '../../types/function.type';
import { ORG_UNITS_IDS } from '../../graphql/queries/get-orgUnits';
import { UPDATE_FUNCTIONS } from '../../graphql/mutations/update-function';
import client from '../../lib/apolloClient';
import { OrgUnit } from '../../types/orgUnit.type';

interface EditFunctionModalProps {
  open: boolean;
  onClose: () => void;
  functionData: Function | undefined
  refetch: () => void;
}

const EditFunctionModal = ({
  open,
  onClose,
  functionData,
  refetch,
}: EditFunctionModalProps) => {
  console.log('EDIT FUNCTION MODAL');
  const [functionName, setFunctionName] = useState(functionData?.functionName);
  const [isSaving, setIsSaving] = useState(false);
  const [orgUnitId, setOrgUnitId] = useState(functionData?.orgUnit);
  const [isSingleUser, setIsSingleUser] = useState(functionData?.isSingleUser);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });


  // Update state wenn `functionData`  sich ändert
  useEffect(() => {
    if (functionData) {
      setFunctionName(functionData.functionName);
      setOrgUnitId(functionData.orgUnit);
      setIsSingleUser(functionData.isSingleUser);
    }
  }, [functionData]);

  const { data: orgUnitsData, loading: orgUnitsLoading } = useQuery(
    ORG_UNITS_IDS,
    { client },
  );

   const orgUnitsMap = new Map(
     orgUnitsData?.getData.data.map((unit) => [unit._id, unit.name]),
   );

   const options = orgUnitsData?.getData.data.map((unit: OrgUnit) => ({
       ...unit,
     displayName: `${unit.name} (${orgUnitsMap.get(unit.parentId)})`,
   }));


  const [updateFunction] = useMutation(UPDATE_FUNCTIONS, { client });
  const validateFunctionName = (name: string) => /^[a-zA-Z\s]+$/.test(name);

  const handleSave = async () => {
    if (!validateFunctionName(functionName!)) {
      console.error('Invalid function name');
      return;
    }

    setIsSaving(true);

    try {
      await updateFunction({
        variables: {
          value: functionData?.functionName, // Der alte Name der Funktion
          newFunctionName: functionName ?? functionData?.functionName, // Der neue Name der Funktion (falls geändert)
          newOrgUnit: orgUnitId ?? functionData?.orgUnit, // Die neue OrgUnit-ID (falls geändert)
          newIsSingleUser: isSingleUser ?? functionData?.isSingleUser, // Der neue Status (falls geändert)
        },
      });
      setSnackbar({
        open: true,
        message: 'Explizierte Funktion erfolgreich erstellt.',
      });
      refetch();
      setIsSaving(false);
      onClose();
    } catch (error) {
      console.error('Error updating function:', error);
      setSnackbar({
        open: true,
        message: error.message,
      });
      setIsSaving(false);
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
          <Typography variant="h6">Funktion bearbeiten</Typography>
          <TextField
            label="Funktionsname"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Autocomplete
            options={options}
            loading={orgUnitsLoading}
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
            value={
              orgUnitsData?.getData.data.find((ou) => ou._id === orgUnitId) ||
              null
            }
            onChange={(_, newValue) => setOrgUnitId(newValue?._id || undefined)}
            renderInput={(params) => (
              <TextField {...params} label="Organisationseinheit" />
            )}
          />
          <Typography>Einzelnutzer?</Typography>
          <RadioGroup
            row
            value={isSingleUser ? 'true' : 'false'}
            onChange={(e) => setIsSingleUser(e.target.value === 'true')}
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
