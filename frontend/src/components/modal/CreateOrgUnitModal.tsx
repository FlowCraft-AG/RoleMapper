import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { CREATE_ORG_UNIT } from '../../graphql/mutations/create-org-unit'; // Mutation zum Erstellen der Organisationseinheit
import { GET_EMPLOYEES } from '../../graphql/queries/get-users'; // GraphQL-Abfrage importieren
import { client } from '../../lib/apolloClient';
import { UserCredetials } from '../../types/user.type';

interface CreateOrgUnitModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  parentId: string;
}

const CreateOrgUnitModal = ({
  open,
  onClose,
  refetch,
  parentId,
}: CreateOrgUnitModalProps) => {
  const [formData, setFormData] = useState({ name: '', supervisor: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_EMPLOYEES, { client });

  const [createOrgUnit] = useMutation(CREATE_ORG_UNIT, { client });

  // Regular Expression für ObjectId Validierung
  const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);
  const handleCreate = () => {
    if (!formData.name || /\d/.test(formData.name)) {
      setSnackbar({ open: true, message: 'Name darf keine Zahlen enthalten.' });
      return;
    }
    if (formData.supervisor && !isValidObjectId(formData.supervisor)) {
      alert('Supervisor darf nur Buchstaben enthalten.');
      return;
    }

    createOrgUnit({
      variables: {
        name: formData.name,
        supervisor: formData.supervisor || null,
        parentId: parentId,
      },
    })
      .then(() => {
        console.log('Organisationseinheit erfolgreich erstellt.');
        refetch();
        onClose();
        setFormData({ name: '', supervisor: '' });
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({
          open: true,
          message: 'Fehler beim Erstellen der Einheit.',
        });
      });
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
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
            }}
          >
            <Typography variant="h6">Neue Organisationseinheit</Typography>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <FormControl fullWidth>
              <InputLabel id="select-supervisor-label">Supervisor</InputLabel>
              <Select
                labelId="select-supervisor-label"
                value={formData.supervisor}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    supervisor: e.target.value,
                  }))
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Maximale Höhe des Menüs
                      overflowY: 'auto', // Scrollbar für das Menü aktivieren
                    },
                  },
                }}
                sx={{
                  maxHeight: 300, // Maximale Höhe des Select
                  overflowY: 'auto', // Scrollbar für den Fall, dass die Liste zu lang ist
                }}
              >
                {userLoading ? (
                  <MenuItem value="">
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : userError ? (
                  <MenuItem value="">Fehler beim Laden der Benutzer</MenuItem>
                ) : (
                  userData.getData.data.map((user: UserCredetials) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.userId}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={onClose}>
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                Erstellen
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CreateOrgUnitModal;
