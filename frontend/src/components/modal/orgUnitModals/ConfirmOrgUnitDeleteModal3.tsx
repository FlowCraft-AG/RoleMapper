/**
 * Modal zur Anzeige von Funktionen der untergeordneten Organisationseinheiten.
 *
 * @module ChildFunctionsModal
 */

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Modal,
  Typography,
} from '@mui/material';
import { JSX } from 'react';

interface ChildFunctionsModalProps {
  open: boolean; // Gibt an, ob das Modal geöffnet ist.
  onClose: () => void; // Funktion zum Schließen des Modals.
  onContinue: () => void; // Funktion, die aufgerufen wird, wenn der "Weiter"-Button geklickt wird.
  childrenFunctions: {
    orgUnit: string;
    functions: { functionName: string }[];
  }[]; // Liste der Funktionen der untergeordneten Organisationseinheiten.
}

/**
 * Modal zur Anzeige der Funktionen von untergeordneten Organisationseinheiten.
 *
 * @component
 * @param {ChildFunctionsModalProps} props - Die Eigenschaften der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <ChildFunctionsModal
 *   open={true}
 *   onClose={() => console.log('Modal geschlossen')}
 *   onContinue={() => console.log('Weiter gedrückt')}
 *   childrenFunctions={[
 *     {
 *       orgUnit: 'Fakultät A',
 *       functions: [{ functionName: 'Lehrstuhl 1' }, { functionName: 'Lehrstuhl 2' }],
 *     },
 *   ]}
 * />
 */
const ChildFunctionsModal = ({
  open,
  onClose,
  childrenFunctions,
  onContinue,
}: ChildFunctionsModalProps): JSX.Element => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="child-functions-title"
      aria-describedby="child-functions-description"
    >
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
          maxWidth: 600,
          maxHeight: '80vh',
          overflowY: 'auto', // Scrollbar bei langen Inhalten
          boxShadow: 24,
        }}
      >
        {/* Header mit Titel und Schließen-Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            id="child-functions-title"
            variant="h6"
            sx={{ fontWeight: 'bold' }}
          >
            Funktionen von untergeordneten Organisationseinheiten
          </Typography>
          <IconButton
            aria-label="Modal schließen"
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Anzeige der untergeordneten Funktionen */}
        {childrenFunctions.length > 0 ? (
          childrenFunctions.map((child, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {child.orgUnit}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {child.functions.map((func, i) => (
                    <ListItem key={i} sx={{ p: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {func.functionName}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography
            id="child-functions-description"
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

        {/* Action-Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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

export default ChildFunctionsModal;
