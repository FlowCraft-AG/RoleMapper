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

export interface ItemToRender {
  label: string;
  itemId: string;
  id?: string; // Kann undefined sein
  children?: ItemToRender[]; // Rekursive Definition für verschachtelte Kinder
}

interface CustomTreeItemProps extends TreeItem2Props {
  refetch: () => void;
  children?: ReactElement<{ itemsToRender?: ItemToRender[] }>[];
}

const CustomTreeItem = forwardRef(function CustomTreeItem(
  { refetch, slots, slotProps, ...props }: CustomTreeItemProps,
  ref: Ref<HTMLLIElement>,
) {
  const { publicAPI } = useTreeItem2(props);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [hasChildrenModal, setHasChildrenModal] = useState(false);
  const [childrenToDelete, setChildrenToDelete] = useState<ItemToRender[]>([]);
  const [itemId, setItemId] = useState<string>('');

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
    Children.forEach(props.children, (child) => {
      if (isValidElement(child)) {
        const items = child.props.itemsToRender || [];
        childrenWithNames.push(...items);
      }
    });

    if (childrenWithNames.length > 0) {
      setChildrenToDelete(childrenWithNames); // Kinder speichern
      setItemId(props.itemId); // Setze die ID der zu löschenden Organisationseinheit
      setHasChildrenModal(true); // Modal öffnen
    } else {
      setItemId(props.itemId); // Setze die ID der zu löschenden Organisationseinheit
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
            children: props.label,
            id: props.itemId,
            onAdd: handleAdd,
            onDelete: handleDelete,
          },
        }}
      />

      {/* Das ausgelagerte Modal für die Erstellung */}
      <CreateOrgUnitModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refetch={refetch}
        parentId={props.itemId}
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
