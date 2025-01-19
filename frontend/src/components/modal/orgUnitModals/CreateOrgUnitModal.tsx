/**
 * Modal-Komponente zur Erstellung neuer Organisationseinheiten.
 *
 * @module CreateOrgUnitModal
 */

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
import { fetchAllFunctions } from '../../../lib/api/rolemapper/function.api';
import {
  createOrgUnit,
  fetchAllOrgUnits,
} from '../../../lib/api/rolemapper/orgUnit.api';
import { FunctionString } from '../../../types/function.type';
import { OrgUnit } from '../../../types/orgUnit.type';
import FunctionAutocomplete from '../../FunctionAutocomplete';

/**
 * Props für die `CreateOrgUnitModal`-Komponente.
 */
interface CreateOrgUnitModalProps {
  open: boolean; // Gibt an, ob das Modal geöffnet ist.
  onClose: () => void; // Funktion zum Schließen des Modals.
  parentId: string; // Die ID der übergeordneten Organisationseinheit.
  refetch: (orgUnitList: OrgUnit[]) => void; // Callback zur Aktualisierung der Organisationseinheiten.
}

/**
 * Modal-Komponente zur Erstellung einer neuen Organisationseinheit.
 *
 * @component
 * @param {CreateOrgUnitModalProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <CreateOrgUnitModal
 *   open={true}
 *   onClose={() => console.log('Modal schließen')}
 *   parentId="12345"
 *   refetch={(updatedOrgUnits) => console.log('Aktualisierte Einheiten:', updatedOrgUnits)}
 * />
 */
const CreateOrgUnitModal = ({
  open,
  onClose,
  parentId,
  refetch,
}: CreateOrgUnitModalProps) => {
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
  const [creationLoading, setCreationLoading] = useState(false);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);

  /**
   * Lädt die verfügbaren Funktionen und Organisationseinheiten.
   */
  const loadFunctons = useCallback(async () => {
    setFunctionLoading(true);
    try {
      const [functionList, orgUnitList] = await Promise.all([
        fetchAllFunctions(),
        fetchAllOrgUnits(),
      ]);
      setOrgUnits(orgUnitList);
      setFunctionData(functionList);
    } catch (error) {
      console.error('Fehler beim Laden der Funktionen:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Laden der Daten.',
      });
    } finally {
      setFunctionLoading(false);
    }
  }, []);

  /**
   * Validiert den Namen der Organisationseinheit.
   *
   * @returns {boolean} Gibt `true` zurück, wenn der Name gültig ist.
   */
  const validateName = (): boolean => {
    if (!formData.name || !/^[a-zA-ZäöüÄÖÜß]+$/.test(formData.name)) {
      setSnackbar({
        open: true,
        message: 'Name darf nur Buchstaben enthalten.',
      });
      return false;
    }
    return true;
  };

  /**
   * Erstellt eine neue Organisationseinheit.
   */
  const handleCreate = async () => {
    if (!validateName()) return;

    setCreationLoading(true);
    try {
      const updatedOrgUnits = await createOrgUnit(
        formData.name,
        formData.supervisor,
        parentId,
      );
      refetch(updatedOrgUnits);
      setSnackbar({
        open: true,
        message: 'Organisationseinheit erfolgreich erstellt!',
      });
      handleClose();
    } catch (error) {
      console.error('Fehler beim Erstellen:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Erstellen der Organisationseinheit.',
      });
    } finally {
      setCreationLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadFunctons();
    }
  }, [open, loadFunctons]);

  /**
   * Schließt das Modal und setzt das Formular zurück.
   */
  const handleClose = () => {
    setFormData({ name: '', supervisor: undefined });
    onClose();
  };

  /**
   * Sucht den Namen einer Organisationseinheit basierend auf ihrer ID.
   *
   * @param {string} id - Die ID der Organisationseinheit.
   * @returns {string} Der Name der Organisationseinheit oder "Unbekannt".
   */
  const orgUnitLookup = (id: string) => {
    const orgUnit = orgUnits.find((unit) => unit._id === id);
    return orgUnit ? orgUnit.name : 'Unbekannt';
  };

  /**
   * Erstellt den Pfad einer Organisationseinheit basierend auf ihrer ID.
   *
   * @param {string} id - Die ID der Organisationseinheit.
   * @returns {string} Der Pfad der Organisationseinheit.
   */
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
              bgcolor: 'background.paper',
              borderRadius: 3,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              width: '90%',
              maxWidth: 500,
              boxShadow: 8,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Neue Organisationseinheit
            </Typography>
            <TextField
              label="Name der Organisationseinheit"
              value={formData.name}
              error={
                !/^[a-zA-ZäöüÄÖÜß]+$/.test(formData.name) &&
                formData.name !== ''
              }
              helperText={
                !/^[a-zA-ZäöüÄÖÜß]+$/.test(formData.name) &&
                formData.name !== ''
                  ? 'Name darf nur Buchstaben enthalten.'
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              required
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
                  supervisor: value?._id,
                }));
              }}
              label="Supervisor auswählen"
              placeholder="Supervisor suchen..."
              orgUnitPathLookup={orgUnitPathLookup}
              orgUnitLookup={orgUnitLookup}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={creationLoading}
              >
                {creationLoading ? 'Erstellen...' : 'Erstellen'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CreateOrgUnitModal;
