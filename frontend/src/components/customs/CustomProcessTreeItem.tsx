import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import {
  Children,
  forwardRef,
  isValidElement,
  ReactElement,
  Ref,
  useState,
} from 'react';
import { removeProcess } from '../../lib/api/rolemapper/process.api';
import { StyledTreeItem } from '../../styles/StyleTreeItem';
import { ConfirmChildrenDeleteDialog } from '../modal/processModals/ConfirmChildrenDeleteDialog';
import { ConfirmFinalDeleteDialog } from '../modal/processModals/ConfirmFinalDeleteDialog';
import CreateProcessCollectionModal from '../modal/processModals/CreateProcessModal';
import EditProcessCollectionModal from '../modal/processModals/EditProcessCollectionModal';
import { CustomLabelProps, CustomProcessLabel } from './CustomProcessLabel';

export interface ItemToRender {
  label: string;
  itemId: string;
  id?: string; // Kann undefined sein
  children?: ItemToRender[]; // Rekursive Definition für verschachtelte Kinder
}

export interface ChildProp {
  itemsToRender?: ItemToRender[]; // Optional, falls es fehlen könnte
}
interface CustomTreeItemProps extends TreeItem2Props {
  onRemove: () => void; // Übergibt ein Array von IDs
  refetch: () => Promise<void>; // Die refetch-Methode
  children?: ReactElement<ChildProp>[] | ReactElement<ChildProp>; // Optional, falls es verschachtelte Organisationseinheiten gibt
}

export const CustomProcessTreeItem = forwardRef(function CustomProcessTreeItem(
  { onRemove, refetch, slots, slotProps, ...props }: CustomTreeItemProps,
  ref: Ref<HTMLLIElement>,
) {
  const { itemId, label, children } = props;
  const kids = children as ReactElement<ChildProp>;
  const itemsToRender = kids?.props?.itemsToRender;

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [childrenToDelete, setChildrenToDelete] = useState<ItemToRender[]>([]);
  const [openChildrenModal, setOpenChildrenModal] = useState(false); // modal 2
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false); // modal 4

  const handleAdd = () => {
    setOpenCreateModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  const handleDelete = async () => {
    // Prüfe, ob Kinder existieren
    const childrenWithNames: ItemToRender[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        const items = child.props.itemsToRender || [];
        childrenWithNames.push(...items);
      }
    });

    // Falls keine Funktionen vorhanden sind, prüfen wir die Nachkommen
    if (childrenWithNames.length > 0) {
      setChildrenToDelete(childrenWithNames); // Kinder speichern
      setOpenChildrenModal(true); // Modal für Kinder öffnen
      return;
    }

    // Direkt zum finalen Dialog, wenn keine Kinder vorhanden sind
    setOpenConfirmDeleteModal(true);
  };

  const handleFinalDelete = async () => {
    try {
      // Entferne die aktuelle ID und alle Kinder
      const idsToDelete = [
        itemId,
        ...childrenToDelete.map((child) => child.itemId),
      ];

      await Promise.all(idsToDelete.map((id) => removeProcess(id))); // Löscht alle parallel

      onRemove(); // Übergib die IDs an die onRemove-Funktion
      setOpenConfirmDeleteModal(false);
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  return (
    <>
      <StyledTreeItem
        {...props}
        ref={ref}
        slots={{
          ...slots,
          label: CustomProcessLabel,
        }}
        slotProps={{
          ...slotProps,
          label: {
            name: label,
            id: itemId,
            onAdd: handleAdd,
            onDelete: handleDelete,
            onEdit: handleEdit, // Funktion für Edit
            hasRoles: itemsToRender ? itemsToRender?.length > 0 : false,
          } as CustomLabelProps, // Typen explizit festlegen,
        }}
      />
      <CreateProcessCollectionModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        parentId={itemId}
        refetch={refetch}
      />
      <EditProcessCollectionModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        itemId={itemId}
        refetch={refetch}
      />
      <ConfirmChildrenDeleteDialog
        open={openChildrenModal}
        onClose={() => setOpenChildrenModal(false)}
        onConfirm={() => {
          setOpenChildrenModal(false);
          setOpenConfirmDeleteModal(true); // Zum finalen Dialog wechseln
        }}
        childrenToDelete={childrenToDelete}
      />

      <ConfirmFinalDeleteDialog
        open={openConfirmDeleteModal}
        onClose={() => setOpenConfirmDeleteModal(false)}
        onConfirm={() => {
          setOpenConfirmDeleteModal(false);
          handleFinalDelete(); // Hier den finalen Löschvorgang ausführen
        }}
      />
    </>
  );
});
