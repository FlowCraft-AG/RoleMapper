/**
 * @file ExistingRolesModal.tsx
 * @description Modal-Komponente zur Anzeige aller vorhandenen Rollen.
 *
 * @module ExistingRolesModal
 */

import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from '@mui/material';
import { JSX, useState } from 'react';

interface ExistingRolesModalProps {
  open: boolean;
  onClose: () => void;
}

interface Role {
  name: string;
}

const ExistingRolesModal = ({
  open,
  onClose,
}: ExistingRolesModalProps): JSX.Element => {
  const [roles] = useState<Role[]>([]);

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
        <Typography variant="h6" align="center">
          Existierende Rollen
        </Typography>
        <List>
          {roles.map((role, index) => (
            <ListItem key={index}>
              <ListItemText primary={role.name} />
            </ListItem>
          ))}
        </List>
        <Button variant="outlined" onClick={onClose} sx={{ marginTop: 2 }}>
          Schließen
        </Button>
      </Box>
    </Modal>
  );
};

export default ExistingRolesModal;
