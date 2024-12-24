import { useMutation } from '@apollo/client';
import { Box, Button, Fade, Modal, Typography } from '@mui/material';
import { DELETE_ORG_UNIT } from '../../graphql/mutations/delete-org-unit';
import client from '../../lib/apolloClient';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  childrenToDelete: string[];
  refetch: () => void;
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  itemId,
  childrenToDelete,
  refetch,
}: DeleteConfirmationModalProps) => {
  const [deleteOrgUnit] = useMutation(DELETE_ORG_UNIT, { client });

  const handleDelete = async () => {
    try {
      // Löschen aller Untereinheiten
      for (const id of childrenToDelete) {
        await deleteOrgUnit({ variables: { value: id } });
        console.log(`Eintrag ${id} wurde gelöscht.`);
      }
      // Löschen der aktuellen Organisationseinheit
      await deleteOrgUnit({ variables: { value: itemId } });
      console.log(`Eintrag ${itemId} wurde gelöscht.`);

      // Daten neu laden
      refetch();
      onClose();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
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
