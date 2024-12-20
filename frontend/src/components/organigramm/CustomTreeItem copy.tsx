import { useMutation } from '@apollo/client';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
  Children,
  forwardRef,
  isValidElement,
  MouseEvent,
  ReactElement,
  Ref,
  useState,
} from 'react';
import { CREATE_ORG_UNIT } from '../../graphql/mutations/create-org-unit';
import { DELETE_ORG_UNIT } from '../../graphql/mutations/delete-org-unit';
import client from '../../lib/apolloClient';

interface ItemToRender {
  label: string;
  itemId: string;
  id?: string; // Kann undefined sein
  children?: ItemToRender[]; // Rekursive Definition für verschachtelte Kinder
}

const StyledTreeItem = styled(TreeItem2)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2.25),
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

interface ChildProp {
  itemsToRender?: ItemToRender[]; // Optional, falls es fehlen könnte
}

interface CustomTreeItemProps extends TreeItem2Props {
  refetch: () => void;
  children?: ReactElement<ChildProp>[] | ReactElement<ChildProp>;
}

function CustomLabel({
  children,
  className,
  onAdd,
  onDelete,
}: CustomLabelProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={className}
      spacing={2}
      flexGrow={1}
    >
      <Typography>{children}</Typography>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Eintrag hinzufügen">
          <IconButton
            edge="end"
            color="primary"
            onClick={(e) => {
              e.stopPropagation(); // Blockiere Event nur für den Button
              onAdd(e);
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eintrag löschen">
          <IconButton
            edge="end"
            color="error"
            onClick={(e) => {
              e.stopPropagation(); // Blockiere Event nur für den Button
              onDelete(e);
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

const CustomTreeItem = forwardRef(function CustomTreeItem(
  { refetch, slots, slotProps, ...props }: CustomTreeItemProps,
  ref: Ref<HTMLLIElement>,
) {
  const { publicAPI } = useTreeItem2(props);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [formData, setFormData] = useState({ name: '', supervisor: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [hasChildrenModal, setHasChildrenModal] = useState(false);
  const [childrenToDelete, setChildrenToDelete] = useState<ItemToRender[]>([]);

  const [createOrgUnit] = useMutation(CREATE_ORG_UNIT, { client });
  const [deleteOrgUnit] = useMutation(DELETE_ORG_UNIT, { client });

  const handleAdd = (e: MouseEvent) => {
    setOpenModal(true);
  };

  const collectAllIds = (items: ItemToRender[]): string[] => {
    const ids: string[] = [];

    items.forEach((item) => {
      ids.push(item.itemId); // ID hinzufügen
      if (item.children && item.children.length > 0) {
        ids.push(...collectAllIds(item.children)); // Rekursiv Kinder-IDs sammeln
      }
    });

    return ids;
  };

  const handleDelete = async (e: React.MouseEvent) => {
    if (!openConfirm) {
      // Extrahiere `itemsToRender` aus `props.children`
      const childrenWithNames: ItemToRender[] = [];

      Children.forEach(props.children, (child) => {
        if (isValidElement<ChildProp>(child)) {
          const items = child.props.itemsToRender || []; // Default-Wert
          childrenWithNames.push(...items);
        }
      });

      if (childrenWithNames.length > 0) {
        setChildrenToDelete(childrenWithNames); // Kinder speichern
        setHasChildrenModal(true); // Modal öffnen
        return;
      }
      setOpenConfirm(true);
    } else {
      const allIdsToDelete = collectAllIds(childrenToDelete);
      // allIdsToDelete.push(props.itemId); // Haupt-Element hinzufügen
      for (const id of allIdsToDelete) {
        await deleteOrgUnit({ variables: { value: id } });
        console.log(`Eintrag ${id} wurde gelöscht.`);
      }
      console.log(`alle kinder wurden gelöscht.`);

      deleteOrgUnit({ variables: { value: props.itemId } })
        .then(() => {
          console.log(`Eintrag ${props.itemId} wurde gelöscht.`);
          refetch(); // Daten neu laden
          setOpenConfirm(false);
          setHasChildrenModal(false);
        })
        .catch((err) => {
          console.error(err);
          setSnackbar({
            open: true,
            message: 'Fehler beim Löschen der Einheit.',
          });
        });
    }
  };

  const renderChildren = (children: ItemToRender[]) => (
    <ul>
      {children.map((child) => (
        <li key={child.itemId}>
          {child.label}
          {child.children && renderChildren(child.children)}
        </li>
      ))}
    </ul>
  );

  const handleCreate = () => {
    if (!formData.name || /\d/.test(formData.name)) {
      setSnackbar({ open: true, message: 'Name darf keine Zahlen enthalten.' });
      return;
    }
    if (formData.supervisor && /\d/.test(formData.supervisor)) {
      alert('Supervisor darf nur Buchstaben enthalten.');
      return;
    }

    createOrgUnit({
      variables: {
        name: formData.name,
        supervisor: formData.supervisor || null,
        parentId: props.itemId,
      },
    })
      .then(() => {
        console.log('Organisationseinheit erfolgreich erstellt.');
        refetch(); // Daten neu laden
        setOpenModal(false);
        setFormData({ name: '', supervisor: '' });
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({
          open: true,
          message: 'Fehler beim Erstellen der Einheit.',
        });
      });
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
      <StyledTreeItem
        {...props}
        ref={ref}
        slots={{
          ...slots,
          label: CustomLabel,
        }}
        slotProps={{
          ...slotProps,
          label: {
            children: props.label,
            id: props.itemId,
            onAdd: handleAdd,
            onDelete: handleDelete,
          } as CustomLabelProps,
        }}
      />

      {/* Modal für Hinzufügen */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        disableEscapeKeyDown={false} // Standardmäßig aktiv
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
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
            }}
          >
            <Typography variant="h6">Neue Organisationseinheit</Typography>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <TextField
              label="Supervisor"
              value={formData.supervisor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, supervisor: e.target.value }))
              }
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={() => setOpenModal(false)}>
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                Erstellen
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Bestätigungsdialog für Löschen */}
      <Modal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        disableEscapeKeyDown={false} // Standardmäßig aktiv
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openConfirm}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 4,
              width: 300,
            }}
          >
            <Typography variant="h6">Löschen bestätigen</Typography>
            <Typography>
              Möchten Sie diese Organisationseinheit wirklich löschen?
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
            >
              <Button variant="outlined" onClick={() => setOpenConfirm(false)}>
                Abbrechen
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Löschen
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Bestätigungsdialog für Löschen bei kindern */}
      <Modal
        open={hasChildrenModal}
        onClose={() => setHasChildrenModal(false)}
        disableEscapeKeyDown={false}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={hasChildrenModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 4,
              width: 400,
            }}
          >
            <Typography variant="h6">Löschen bestätigen</Typography>
            <Typography>
              Diese Organisationseinheit hat folgende Untereinheiten, die
              ebenfalls gelöscht werden:
            </Typography>
            {renderChildren(childrenToDelete)}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={() => setHasChildrenModal(false)}
              >
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setHasChildrenModal(false);
                  setOpenConfirm(true); // Das reguläre Bestätigungsfenster öffnen
                }}
              >
                Weiter
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
});

export default CustomTreeItem;
