/**
 * Modal zur Anzeige der Funktionen einer Organisationseinheit.
 *
 * @module OrgUnitFunctionsModal
 */

import { Box, Button, List, ListItem, Modal, Typography } from '@mui/material';

/**
 * Props für die `OrgUnitFunctionsModal`-Komponente.
 */
interface OrgUnitFunctionsModalProps {
  open: boolean; // Gibt an, ob das Modal geöffnet ist.
  onClose: () => void; // Funktion zum Schließen des Modals.
  onContinue: () => void; // Funktion, die aufgerufen wird, wenn der "Weiter"-Button geklickt wird.
  functions: { functionName: string; orgUnit: string }[]; // Liste der Funktionen, die zur Organisationseinheit gehören.
  orgUnit: string; // Name der Organisationseinheit.
}

/**
 * Modal zur Anzeige der Funktionen einer Organisationseinheit.
 *
 * @component
 * @param {OrgUnitFunctionsModalProps} props - Die Eigenschaften der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <OrgUnitFunctionsModal
 *   open={true}
 *   onClose={() => console.log('Modal geschlossen')}
 *   onContinue={() => console.log('Weiter geklickt')}
 *   functions={[{ functionName: 'Manager', orgUnit: 'HR' }]}
 *   orgUnit="Personalabteilung"
 * />
 */
const OrgUnitFunctionsModal = ({
  open,
  onClose,
  onContinue,
  functions,
  orgUnit,
}: OrgUnitFunctionsModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          width: '90%',
          maxWidth: 500,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Funktionen der Organisationseinheit: {orgUnit}
        </Typography>
        {functions.length > 0 ? (
          <List
            sx={{
              bgcolor: 'background.default',
              borderRadius: 2,
              mb: 3,
              maxHeight: 200,
              overflowY: 'auto', // Scrollbar bei Bedarf
            }}
          >
            {functions.map((func, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  p: 1.5,
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Typography variant="body2">{func.functionName}</Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              fontStyle: 'italic',
              mb: 3,
            }}
          >
            Keine Funktionen vorhanden
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            sx={{ minWidth: 120 }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={onContinue}
            variant="contained"
            color="primary"
            sx={{ minWidth: 120 }}
          >
            Weiter
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrgUnitFunctionsModal;
