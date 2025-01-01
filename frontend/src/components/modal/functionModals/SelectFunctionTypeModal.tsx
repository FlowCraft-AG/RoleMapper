import { Box, Button, Modal, Stack, Typography } from '@mui/material';

interface SelectFunctionTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
}

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
