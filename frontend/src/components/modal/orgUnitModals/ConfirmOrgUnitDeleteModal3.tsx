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

const ChildFunctionsModal = ({
  open,
  onClose,
  childrenFunctions,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: () => void; // Funktion für "Weiter"
  childrenFunctions: {
    orgUnit: string;
    functions: { functionName: string }[];
  }[];
}) => {
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
          maxWidth: 600,
          boxShadow: 24,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Funktionen von untergeordneten Organisationseinheiten
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

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
