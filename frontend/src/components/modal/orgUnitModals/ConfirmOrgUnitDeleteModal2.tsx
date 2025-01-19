/**
 * @file ConfirmDeleteModal.tsx
 * @description Modal zur Bestätigung der Löschung einer Organisationseinheit und ihrer Untereinheiten.
 *
 * @module ConfirmDeleteModal
 */

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
import { ItemToRender } from '../../customs/CustomOrgUnitTreeItem';

/**
 * Props für die `ConfirmDeleteModal`-Komponente.
 */
interface ConfirmDeleteModalProps {
  open: boolean; // Gibt an, ob das Modal geöffnet ist.
  onClose: () => void; // Funktion zum Schließen des Modals.
  childrenToDelete: ItemToRender[]; // Liste der untergeordneten Elemente, die gelöscht werden.
  onConfirm: () => void; // Funktion, die aufgerufen wird, wenn der "Weiter"-Button geklickt wird.
}

/**
 * Modal zur Bestätigung der Löschung einer Organisationseinheit und ihrer Untereinheiten.
 *
 * @component
 * @param {ConfirmDeleteModalProps} props - Die Eigenschaften der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <ConfirmDeleteModal
 *   open={true}
 *   onClose={() => console.log('Modal geschlossen')}
 *   onConfirm={() => console.log('Löschung bestätigt')}
 *   childrenToDelete={[
 *     { itemId: '1', label: 'Untereinheit 1', children: [{ itemId: '2', label: 'Untereinheit 2' }] },
 *   ]}
 * />
 */
function ConfirmDeleteModal({
  open,
  onClose,
  childrenToDelete,
  onConfirm,
}: ConfirmDeleteModalProps) {
  // Zustand, um die expandierten Kinder zu verfolgen
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  /**
   * Toggle-Funktion zum Erweitern oder Reduzieren von Einträgen.
   *
   * @param {string} itemId - Die ID des Eintrags.
   */
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
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh', // Begrenzung der maximalen Höhe
            overflowY: 'auto', // Aktiviert Scrollen bei großen Daten
            boxShadow: 24,
          }}
        >
          <Typography
            id="delete-confirmation-title"
            variant="h6"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Löschung bestätigen
          </Typography>
          <Typography id="delete-confirmation-description" sx={{ mb: 3 }}>
            Diese Organisationseinheit hat folgende untergeordnete Einheiten,
            die ebenfalls gelöscht werden:
          </Typography>

          {/* Liste der Kinder mit Aufklappfunktion */}
          <List>
            {childrenToDelete.map((child) => (
              <div key={child.itemId}>
                <ListItemButton
                  onClick={() => handleToggle(child.itemId)}
                  sx={{
                    display: 'list-item',
                    bgcolor: expandedItems.includes(child.itemId)
                      ? 'action.hover'
                      : 'background.paper',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {child.label}
                      </Typography>
                    }
                    secondary={
                      child.children &&
                      `${child.children.length} Untereinheiten`
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
                        <ListItem
                          key={subChild.itemId}
                          sx={{
                            pl: 4,
                            py: 1,
                            bgcolor: 'background.default',
                            mb: 1,
                            borderRadius: 1,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                {subChild.label}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                </Collapse>
              </div>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              color="secondary"
              sx={{ minWidth: 120 }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              color="error"
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
