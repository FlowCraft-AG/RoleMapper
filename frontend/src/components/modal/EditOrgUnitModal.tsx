import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  darken,
  Fade,
  lighten,
  Modal,
  Snackbar,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useEffect, useState } from 'react';
import {
  fetchEmployees,
  getOrgUnitById,
  updateOrgUnit,
} from '../../app/organisationseinheiten/fetchkp';
import { OrgUnit } from '../../types/orgUnit.type';
import { UserCredetials } from '../../types/user.type';

interface EditOrgUnitModalProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  refetch: (orgUnitList: OrgUnit[]) => void; // Callback zur Aktualisierung der Organisationseinheitenliste
}

const EditOrgUnitModal = ({
  open,
  onClose,
  itemId,

  refetch,
}: EditOrgUnitModalProps) => {
  const [formData, setFormData] = useState({ name: '', supervisor: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [userError, setUserError] = useState<string>('');
  const [userData, setUserData] = useState<UserCredetials[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // Supervisor-ID muss ein gültiges MongoDB ObjectId sein
  const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

  // Funktion zum Laden der Organisationseinheit
  const loadOrgUnitData = async () => {
    setLoading(true);
    try {
      const orgUnit = await getOrgUnitById(itemId); // API-Aufruf zum Laden der Organisationseinheit
      setFormData({
        name: orgUnit.name || '',
        supervisor: orgUnit.supervisor || '', // Supervisor-ID laden
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Fehler beim Laden der Organisationseinheit.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Funktion zum Abrufen der Benutzer von der Serverseite
  const loadUsers = async () => {
    setLoading(true);
    try {
      const employees = await fetchEmployees(); // Serverseitige Funktion aufrufen
      setUserData(employees);
    } catch (error) {
      if (error instanceof Error) {
        setUserError(error.message);
        setSnackbar({ open: true, message: error.message });
      } else {
        setSnackbar({ open: true, message: 'Fehler beim Laden der Benutzer.' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadOrgUnitData(); // Lade Daten der Organisationseinheit
      loadUsers(); // Abrufen der Benutzer beim Öffnen des Modals
    }
  }, [open, itemId]);

  const handleSave = async () => {
    if (!formData.name) {
      setSnackbar({
        open: true,
        message: 'Name darf nicht leer sein.',
      });
      return;
    }

    if (formData.supervisor && !isValidObjectId(formData.supervisor)) {
      setSnackbar({
        open: true,
        message: 'Supervisor-ID muss ein gültiges MongoDB ObjectId sein.',
      });
      return;
    }

    setLoading(true);
    try {
      const newOrgUnitList = await updateOrgUnit(
        itemId,
        formData.name,
        formData.supervisor,
      ); // Bearbeite die Organisationseinheit
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
          message: 'Ein Fehler ist aufgetreten.',
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

  const options: UserCredetials[] = userData;

  const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles('dark', {
      backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
  }));

  const GroupItems = styled('ul')({
    padding: 0,
  });

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
                          boxShadow: 24,
              height: 300,
            }}
          >
            <Typography variant="h6">
              Organisationseinheit bearbeiten
            </Typography>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
            />

            <Autocomplete
              options={options}
              loading={loading}
              groupBy={(option) => option.userId[0].toUpperCase()}
              getOptionLabel={(option) => option.userId}
              renderGroup={(params) => (
                <li key={params.key}>
                  <GroupHeader>{params.group}</GroupHeader>
                  <GroupItems>{params.children}</GroupItems>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supervisor"
                  placeholder="Supervisor auswählen"
                  error={!!errors.supervisor}
                  helperText={errors.supervisor || ''}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
              value={
                options.find((user) => user._id === formData.supervisor) || null
              } // Supervisor über _id suchen
              onChange={(_, value) => {
                setFormData((prev) => ({
                  ...prev,
                  supervisor: value?._id || '',
                }));
                // Fehler zurücksetzen, wenn eine Auswahl getroffen wird
                setErrors((prev) => ({ ...prev, supervisor: null }));
              }}
              renderOption={(props, option, { inputValue }) => {
                const matches = match(option.userId, inputValue, {
                  insideWords: true,
                });
                const parts = parse(option.userId, matches);

                return (
                  <li {...props} key={props.key}>
                    {/* <li key={props.key}></li> */}
                    <div>
                      {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={onClose}>
                Abbrechen
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Erstellen
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditOrgUnitModal;
