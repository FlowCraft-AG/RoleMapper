import { Box, Button, Fade, Modal, Typography } from '@mui/material';
import { useState } from 'react';
import { removeOrgUnit } from '../../app/organisationseinheiten/fetchkp';
import { OrgUnit } from '../../types/orgUnit.type';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  childrenToDelete: string[];
  refetch: (orgUnitList: OrgUnit[]) => void; // Callback zur Aktualisierung der Organisationseinheitenliste
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  itemId,
  childrenToDelete,
  refetch,
}: DeleteConfirmationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Lösche alle Kinder
      for (const childId of childrenToDelete) {
        await removeOrgUnit(childId); // Lösche die Kinder
      }

      // Lösche die Hauptorganisationseinheit
      const newOrgUnitList = await removeOrgUnit(itemId);
      await refetch(newOrgUnitList); // Lade die neuesten Daten
      onClose(); // Schließe das Modal
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Fehler beim Löschen der Organisationseinheit',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
  );
};

export default DeleteConfirmationModal;
