import {
  Box,
  Button,
  Fade,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchAllFunctions } from '../../../lib/api/function.api';
import {
  fetchAllOrgUnits,
  getOrgUnitById,
  updateOrgUnit,
} from '../../../lib/api/orgUnit.api';
import { FunctionString } from '../../../types/function.type';
import { OrgUnit } from '../../../types/orgUnit.type';
import FunctionAutocomplete from '../../FunctionAutocomplete';

interface EditOrgUnitModalProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  refetch: (orgUnitList: OrgUnit[]) => void;
}

const EditOrgUnitModal = ({
  open,
  onClose,
  itemId,
  refetch,
}: EditOrgUnitModalProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    supervisor?: string;
  }>({
    name: '',
    supervisor: undefined,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [functionData, setFunctionData] = useState<FunctionString[]>([]);
  const [functionLoading, setFunctionLoading] = useState(false);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);

  const logError = (message: string, error: unknown) => {
    console.error(message, error);
    setSnackbar({
      open: true,
      message: typeof error === 'string' ? error : message,
    });
  };

  const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

  const loadData = useCallback(async () => {
    try {
      const [orgUnit, functions, orgUnitList] = await Promise.all([
        getOrgUnitById(itemId),
        fetchAllFunctions(),
        fetchAllOrgUnits(),
      ]);
      setFormData({
        name: orgUnit.name || '',
        supervisor: orgUnit.supervisor,
      });
      setFunctionData(functions);
      setOrgUnits(orgUnitList);
    } catch (error) {
      logError('Fehler beim Laden der Daten:', error);
    }
  }, [itemId]);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, loadData]);

  const handleSave = async () => {
    if (!formData.name) {
      setSnackbar({ open: true, message: 'Name darf nicht leer sein.' });
      return;
    }

    if (formData.supervisor && !isValidObjectId(formData.supervisor)) {
      setSnackbar({
        open: true,
        message: 'Supervisor-ID muss ein gültiges MongoDB ObjectId sein.',
      });
      return;
    }

    try {
      const newOrgUnitList = await updateOrgUnit(
        itemId,
        formData.name,
        formData.supervisor,
      );
      refetch(newOrgUnitList);
      onClose();
    } catch (error) {
      logError('Fehler beim Speichern der Organisationseinheit:', error);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', supervisor: undefined });
    onClose();
  };

  const orgUnitLookup = (id: string) => {
    const orgUnit = orgUnits.find((unit) => unit._id === id);
    return orgUnit ? orgUnit.name : 'Unbekannt';
  };

  const orgUnitPathLookup = (id: string): string => {
    const path: string[] = [];
    let currentId = id;

    while (currentId) {
      const orgUnit = orgUnits.find((unit) => unit._id === currentId);
      if (!orgUnit) break;

      path.unshift(orgUnit.name);
      currentId = orgUnit.parentId || '';
    }

    return path.join(' > ');
  };

  return (
    <>
      <Snackbar
        key={snackbar.message}
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.default',
              borderRadius: 3,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              width: 480,
              boxShadow: 10,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Organisationseinheit bearbeiten
            </Typography>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
            />
            <FunctionAutocomplete
              options={functionData}
              loading={functionLoading}
              value={
                functionData.find((func) => func._id === formData.supervisor) ||
                null
              }
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  supervisor: value ? value._id : undefined,
                }));
              }}
              label="Supervisor auswählen"
              placeholder="Supervisor suchen..."
              orgUnitLookup={orgUnitLookup}
              orgUnitPathLookup={orgUnitPathLookup}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  flex: 1,
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  '&:hover': {
                    borderColor: 'secondary.dark',
                    backgroundColor: 'secondary.light',
                  },
                }}
              >
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{
                  flex: 1,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Speichern
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditOrgUnitModal;
