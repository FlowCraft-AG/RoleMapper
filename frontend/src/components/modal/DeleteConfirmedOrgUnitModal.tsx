import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Modal,
  Snackbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  removeFunction,
  removeOrgUnit,
} from '../../app/organisationseinheiten/fetchkp';
import { Function } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { ItemToRender } from '../customs/CustomTreeItem';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  childrenToDelete: ItemToRender[];
  refetch: (orgUnitList: OrgUnit[]) => void; // Callback zur Aktualisierung der Organisationseinheitenliste
  functionList: Function[];
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  itemId,
  childrenToDelete,
  refetch,
  functionList,
}: DeleteConfirmationModalProps) => {
  console.log('DeleteConfirmationModalProps: ', childrenToDelete);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleRemoveFunction = async (func: Function) => {
    const success = await removeFunction(func._id, func.orgUnit); // Serverseitige Funktion aufrufen
    if (success) {
      return success;
    } else {
      setSnackbar({
        open: true,
        message: 'Fehler beim Entfernen der Funktion.',
      });
    }
  };

  const removeOrgUnitRecursively = async (item: ItemToRender) => {
    // Lösche alle Kinder rekursiv
    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        await removeOrgUnitRecursively(child); // Rekursiver Aufruf für jedes Kind
      }
    }

    // Lösche das aktuelle Element
    await removeOrgUnit(item.itemId);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (functionList.length > 0) {
        for (const func of functionList) {
          const success = await handleRemoveFunction(func);
          if (success) {
            console.log('Function removed');
          }
        }
      }

      // Lösche alle Kinder
      for (const childId of childrenToDelete) {
        await removeOrgUnitRecursively(childId); // Lösche die Kinder
      }

      // Lösche die Hauptorganisationseinheit
      const newOrgUnitList = await removeOrgUnit(itemId);
      await refetch(newOrgUnitList); // Lade die neuesten Daten
      onClose(); // Schließe das Modal
    } catch (error) {
      if (error instanceof Error) {
        setSnackbar({
          open: true,
          message: error.message,
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Fehler beim Löschen der Organisationseinheit.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );

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
        disableEscapeKeyDown={false}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
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
              borderRadius: 2,
              p: 4,
              width: 300,
            }}
          >
            <Typography variant="h6">Löschen bestätigen</Typography>
            <Typography>
              Möchten Sie diese Organisationseinheit wirklich löschen? Alle
              Untereinheiten werden ebenfalls gelöscht.
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
            >
              <Button variant="outlined" onClick={onClose}>
                Abbrechen
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Löschen
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
