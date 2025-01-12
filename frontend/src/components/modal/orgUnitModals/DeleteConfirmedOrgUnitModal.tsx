/**
 * @file DeleteConfirmationModal.tsx
 * @description Modal zur Bestätigung der Löschung einer Organisationseinheit und ihrer Untereinheiten.
 *
 * @module DeleteConfirmationModal
 */

import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Modal,
  Snackbar,
  Typography,
} from '@mui/material';
import { JSX, useState } from 'react';
import { removeFunction } from '../../../lib/api/rolemapper/function.api';
import { removeOrgUnit } from '../../../lib/api/rolemapper/orgUnit.api';
import { FunctionString } from '../../../types/function.type';
import { OrgUnit } from '../../../types/orgUnit.type';
import { ItemToRender } from '../../customs/CustomTreeItem';

interface DeleteConfirmationModalProps {
  open: boolean; // Ob das Modal geöffnet ist.
  onClose: () => void; // Funktion zum Schließen des Modals.
  itemId: string; // ID der Organisationseinheit, die gelöscht werden soll.
  childrenToDelete: ItemToRender[]; // Untergeordnete Organisationseinheiten.
  refetch: (orgUnitList: OrgUnit[]) => void; // Callback zur Aktualisierung der Organisationseinheitenliste.
  functionList: FunctionString[]; // Liste der zugehörigen Funktionen.
  onRemove: (ids: string[]) => void; // Callback mit allen gelöschten IDs.
}

/**
 * Modal zur Bestätigung der Löschung einer Organisationseinheit und ihrer Untereinheiten.
 *
 * @component
 */
const DeleteConfirmationModal = ({
  open,
  onClose,
  itemId,
  childrenToDelete,
  refetch,
  functionList,
  onRemove,
}: DeleteConfirmationModalProps): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  /**
   * Funktion zum Entfernen einer Funktion.
   * @param func Die zu entfernende Funktion.
   */
  const handleRemoveFunction = async (func: FunctionString) => {
    try {
      const success = await removeFunction(func._id, func.orgUnit);
      if (!success) {
        throw new Error('Fehler beim Entfernen der Funktion.');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : 'Fehler beim Entfernen der Funktion.',
      });
    }
  };

  /**
   * Rekursive Funktion zum Sammeln aller IDs (inkl. Kinder).
   * @param item Das aktuelle Element.
   */
  const collectAllIds = (item: ItemToRender): string[] => {
    let ids = [item.itemId];
    if (item.children) {
      for (const child of item.children) {
        ids = ids.concat(collectAllIds(child));
      }
    }
    return ids;
  };

  /**
   * Rekursive Funktion zum Entfernen einer Organisationseinheit und ihrer Kinder.
   * @param item Das aktuelle Element.
   */
  const removeOrgUnitRecursively = async (item: ItemToRender) => {
    if (item.children) {
      for (const child of item.children) {
        await removeOrgUnitRecursively(child);
      }
    }
    await removeOrgUnit(item.itemId);
  };

  /**
   * Hauptfunktion zum Löschen der Organisationseinheit.
   */
  const handleDelete = async () => {
    setLoading(true);
    try {
      const allIds = [itemId, ...childrenToDelete.flatMap(collectAllIds)];

      for (const func of functionList) {
        await handleRemoveFunction(func);
      }

      for (const child of childrenToDelete) {
        await removeOrgUnitRecursively(child);
      }

      const updatedOrgUnits = await removeOrgUnit(itemId);
      refetch(updatedOrgUnits);
      onRemove(allIds);
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : 'Fehler beim Löschen der Organisationseinheit.',
      });
    } finally {
      setLoading(false);
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

      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        closeAfterTransition
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 4,
              width: 300,
              boxShadow: 24,
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Typography
                  id="delete-confirmation-title"
                  variant="h6"
                  sx={{ mb: 2 }}
                >
                  Löschung bestätigen
                </Typography>
                <Typography id="delete-confirmation-description" sx={{ mb: 3 }}>
                  Möchten Sie diese Organisationseinheit wirklich löschen? Alle
                  Untereinheiten werden ebenfalls gelöscht.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button variant="outlined" onClick={onClose}>
                    Abbrechen
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                  >
                    Löschen
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
