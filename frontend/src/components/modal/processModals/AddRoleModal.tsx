/**
 * @file AddRoleModal.tsx
 * @description Modal-Komponente zum Hinzufügen einer neuen Rolle.
 *
 * @module RoleModal
 */

'use client';

import { Box, Typography, Modal, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { JSX } from 'react';

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal-Komponente für das Hinzufügen einer neuen Rolle.
 *
 * @param {RoleModalProps} props - Eigenschaften der Komponente.
 * @returns {JSX.Element} - JSX-Element für das Modal.
 */
export default function RoleModal({ open, onClose }: RoleModalProps): JSX.Element {
  const [functionName, setFunctionName] = useState('');
  const [errors, setErrors] = useState<{ functionName?: string }>({});

  const handleSave = () => {
    if (!functionName) {
      setErrors({ functionName: 'Der Name der Rolle ist erforderlich.' });
      return;
    }
    // Hier können Sie die Logik für das Speichern der Rolle implementieren
    console.log('Neue Rolle gespeichert:', functionName);
    setFunctionName('');
    setErrors({});
    onClose();
  };

  const resetFields = () => {
    setFunctionName('');
    setErrors({});
  };

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
          gap: 2,
          width: 400,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6">Neue Rolle </Typography>
        <TextField
          label="Name der Rolle"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          fullWidth
          error={!!errors.functionName}
          helperText={errors.functionName}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Speichern
        </Button>
        <Button
          variant="outlined"
          sx={{ marginTop: 2 }}
          onClick={() => {
            resetFields();
            onClose();
          }}
        >
          Abbrechen
        </Button>
      </Box>
    </Modal>
  );
}
