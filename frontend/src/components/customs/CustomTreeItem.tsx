import { useMutation } from '@apollo/client';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
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
import { DELETE_ORG_UNIT } from '../../graphql/mutations/delete-org-unit';
import client from '../../lib/apolloClient';
import { StyledTreeItem } from '../../styles/StyleTreeItem';
import { CustomLabel } from '../customs/CustomLabel';
import ConfirmDeleteModal from '../modal/ConfirmOrgUnitDeleteModal';
import CreateOrgUnitModal from '../modal/CreateOrgUnitModal';
import DeleteConfirmationModal from '../modal/DeleteConfirmedOrgUnitModal'; // Importiere das ausgelagerte Delete-Modal
import EditOrgUnitModal from '../modal/EditOrgUnitModal';

export interface ItemToRender {
  label: string;
  itemId: string;
  id?: string; // Kann undefined sein
  children?: ItemToRender[]; // Rekursive Definition für verschachtelte Kinder
}

interface ChildProp {
  itemsToRender?: ItemToRender[]; // Optional, falls es fehlen könnte
}

interface CustomTreeItemProps extends TreeItem2Props {
  refetch: () => void;
  children?: ReactElement<ChildProp>[] | ReactElement<ChildProp>;
}

const CustomTreeItem = forwardRef(function CustomTreeItem(
  { refetch, slots, slotProps, ...props }: CustomTreeItemProps,
  ref: Ref<HTMLLIElement>,
) {
  const { id, itemId, label, children } = props;
  const { publicAPI } = useTreeItem2(props);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [hasChildrenModal, setHasChildrenModal] = useState(false);
  const [childrenToDelete, setChildrenToDelete] = useState<ItemToRender[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenEditModal(true); // Modal öffnen
  };

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

  const handleDelete = (e: MouseEvent) => {
    const childrenWithNames: ItemToRender[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        const items = child.props.itemsToRender || [];
        childrenWithNames.push(...items);
      }
    });

    if (childrenWithNames.length > 0) {
      setChildrenToDelete(childrenWithNames); // Kinder speichern
      setHasChildrenModal(true); // Modal öffnen
    } else {
      setOpenConfirm(true); // Bestätigungs-Modal öffnen
    }
  };

  return (
    <>
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
            children: label,
            id: itemId,
            onAdd: handleAdd,
            onDelete: handleDelete,
            onEdit: handleEdit, // Funktion für Edit
          },
        }}
      />

      {/* Das ausgelagerte Modal für die Erstellung */}
      <CreateOrgUnitModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refetch={refetch}
        parentId={itemId}
      />

      {/* Das ausgelagerte Modal für die Bearbeitung */}
      <EditOrgUnitModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        itemId={itemId}
        refetch={refetch}
      />

      {/* Bestätigungsdialog für das Löschen */}
      <DeleteConfirmationModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onDelete={() => deleteOrgUnit({ variables: { value: itemId } })}
        itemId={itemId}
        childrenToDelete={childrenToDelete.map((child) => child.itemId)}
        refetch={refetch}
      />

      {/* Bestätigungsdialog für das Löschen bei Kindern */}
      <ConfirmDeleteModal
        open={hasChildrenModal}
        onClose={() => setHasChildrenModal(false)}
        childrenToDelete={childrenToDelete}
        renderChildren={childrenToDelete}
        onConfirm={() => setOpenConfirm(true)} // Nach Bestätigung der Kinder, das Lösch-Modal für die Hauptorganisationseinheit öffnen
      />
    </>
  );
});

export default CustomTreeItem;
