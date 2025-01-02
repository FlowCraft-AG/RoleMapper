/**
 * @file SelectFunctionTypeModal.tsx
 * @description Modal-Komponente zur Auswahl eines Funktionstyps (implizit oder explizit).
 *
 * @module SelectFunctionTypeModal
 */

import { Box, Button, Modal, Stack, Typography } from '@mui/material';

/**
 * Props für die `SelectFunctionTypeModal`-Komponente.
 *
 * @interface SelectFunctionTypeModalProps
 * @property {boolean} open - Gibt an, ob das Modal geöffnet ist.
 * @property {() => void} onClose - Callback-Funktion, um das Modal zu schließen.
 * @property {(type: string) => void} onSelectType - Callback-Funktion, die aufgerufen wird, wenn ein Funktionstyp ausgewählt wird.
 */
interface SelectFunctionTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
}

/**
 * `SelectFunctionTypeModal`-Komponente
 *
 * Diese Komponente zeigt ein Modal, in dem der Benutzer zwischen zwei Funktionstypen auswählen kann:
 * - Implizierte Funktion
 * - Explizierte Funktion
 *
 * @component
 * @param {SelectFunctionTypeModalProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <SelectFunctionTypeModal
 *   open={true}
 *   onClose={() => console.log('Modal geschlossen')}
 *   onSelectType={(type) => console.log('Ausgewählter Typ:', type)}
 * />
 */
const SelectFunctionTypeModal = ({
  open,
  onClose,
  onSelectType,
}: SelectFunctionTypeModalProps) => {
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
          Wählen Sie den Funktionstyp
        </Typography>
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSelectType('implizierte')}
            sx={{ padding: 2 }}
          >
            Implizierte Funktion
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSelectType('explizierte')}
            sx={{ padding: 2 }}
          >
            Explizierte Funktion
          </Button>
        </Stack>
        <Button variant="outlined" sx={{ marginTop: 2 }} onClick={onClose}>
          Abbrechen
        </Button>
      </Box>
    </Modal>
  );
};

export default SelectFunctionTypeModal;
