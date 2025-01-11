/**
 * @file SelectAddRoleModal.tsx
 * @description Modal-Komponente zur Auswahl des Hinzufügen von Rollen (neue oder bestehende)
 *
 * @module SelectAddRoleModal
 */

import { Add } from '@mui/icons-material';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';

/**
 * Props für die `SelectAddRoleModal`-Komponente.
 *
 * @interface SelectAddRoleModalProps
 * @property {boolean} open - Gibt an, ob das Modal geöffnet ist.
 * @property {() => void} onClose - Callback-Funktion, um das Modal zu schließen.
 * @property {(type: string) => void} onSelectType - Callback-Funktion, die aufgerufen wird, wenn eine Auswahl getroffen wird.
 */
interface SelectAddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
}

/**
 * `SelectAddRoleModal`-Komponente
 *
 * Diese Komponente zeigt ein Modal, in dem der Benutzer zwischen zwei Arten von Rollen auswählen kann
 * - Bestehende Rolle
 * - Neue Rolle
 *
 * @component
 * @param {SelectAddRoleModalProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <SelectAddRoleModal
 *   open={true}
 *   onClose={() => console.log('Modal geschlossen')}
 *   onSelectType={(type) => console.log('Ausgewählter Typ:', type)}
 * />
 */
const SelectAddRoleModal = ({
  open,
  onClose,
  onSelectType,
}: SelectAddRoleModalProps) => {
  return (
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
          gap: 3,
          width: 400,
          boxShadow: 24,
          zIndex: 1300,
        }}
      >
        <Typography variant="h6" align="center">
          Wähle die Art der Rolle aus
        </Typography>
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSelectType('implizite')}
            sx={{ padding: 2 }}
          >
            Existierende Rolle
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSelectType('explizite')}
            sx={{ padding: 2 }}
          >
            Neue Rolle
          </Button>
        </Stack>
        <Button variant="outlined" sx={{ marginTop: 2 }} onClick={onClose}>
          Abbrechen
        </Button>
      </Box>
    </Modal>
  );
};

export default SelectAddRoleModal;
