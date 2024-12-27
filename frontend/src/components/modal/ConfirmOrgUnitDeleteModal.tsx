import {
  Box,
  Button,
  Collapse,
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { ItemToRender } from '../customs/CustomLabel';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  childrenToDelete: ItemToRender[];
  onConfirm: () => void;
}

function ConfirmDeleteModal({
  open,
  onClose,
  childrenToDelete,
  onConfirm,
}: ConfirmDeleteModalProps) {
  // Zustand, um die expandierten Kinder zu verfolgen
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Toggle-Funktion für das Auf- und Zuklappen der Kinder
  const handleToggle = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
      disableEscapeKeyDown={false}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open} timeout={{ enter: 300, exit: 500 }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 4,
            width: 450,
            maxHeight: '80vh', // Begrenzung der maximalen Höhe
            overflowY: 'auto', // Aktiviert das Scrollen, wenn der Inhalt zu groß ist
            boxShadow: 24,
          }}
        >
          <Typography
            id="delete-confirmation-title"
            variant="h6"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Löschen bestätigen
          </Typography>
          <Typography id="delete-confirmation-description" sx={{ mb: 2 }}>
            Diese Organisationseinheit hat folgende Untereinheiten, die
            ebenfalls gelöscht werden:
          </Typography>

          {/* Liste der Kinder mit Aufklappfunktion */}
          <List>
            {childrenToDelete.map((child) => (
              <div key={child.itemId}>
                <ListItemButton
                  onClick={() => handleToggle(child.itemId)}
                  sx={{ display: 'list-item' }}
                >
                  <ListItemText
                    primary={child.label}
                    secondary={
                      child.children &&
                      `Untereinheiten: ${child.children.length}`
                    }
                  />
                </ListItemButton>

                {/* Wenn Untereinheiten vorhanden sind, diese ein- oder ausklappen */}
                <Collapse
                  in={expandedItems.includes(child.itemId)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {child.children &&
                      child.children.map((subChild) => (
                        <ListItem key={subChild.itemId} sx={{ pl: 4 }}>
                          <ListItemText primary={subChild.label} />
                        </ListItem>
                      ))}
                  </List>
                </Collapse>
              </div>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" onClick={onClose} sx={{ minWidth: 120 }}>
              Abbrechen
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onConfirm}
              sx={{ minWidth: 120 }}
            >
              Weiter
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ConfirmDeleteModal;
