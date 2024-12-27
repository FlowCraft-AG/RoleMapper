import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import {
  Children,
  forwardRef,
  isValidElement,
  MouseEvent,
  ReactElement,
  Ref,
  useState,
} from 'react';
import {
  checkForFunctions,
  fetchFunctionsByOrgUnit,
} from '../../app/organisationseinheiten/fetchkp';
import { StyledTreeItem } from '../../styles/StyleTreeItem';
import { Function } from '../../types/function.type';
import { CustomLabel, CustomLabelProps } from '../customs/CustomLabel';
import OrgUnitFunctionsModal from '../modal/ConfirmOrgUnitDeleteModal1';
import ConfirmDeleteModal from '../modal/ConfirmOrgUnitDeleteModal2';
import ChildFunctionsModal from '../modal/ConfirmOrgUnitDeleteModal3';
import CreateOrgUnitModal from '../modal/CreateOrgUnitModal';
import DeleteConfirmationModal from '../modal/DeleteConfirmedOrgUnitModal'; // Importiere das ausgelagerte Delete-Modal
import EditOrgUnitModal from '../modal/EditOrgUnitModal';
import { on } from 'events';

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
  onRemove: (ids: string[]) => void; // Übergibt ein Array von IDs
  refetch: () => Promise<void>; // Die refetch-Methode
  children?: ReactElement<ChildProp>[] | ReactElement<ChildProp>; // Optional, falls es verschachtelte Organisationseinheiten gibt
}

const CustomTreeItem = forwardRef(function CustomTreeItem(
  { onRemove, refetch, slots, slotProps, ...props }: CustomTreeItemProps,
  ref: Ref<HTMLLIElement>,
) {
  const { itemId, label, children } = props;
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openFunctionsModal, setOpenFunctionsModal] = useState(false); // Modal 1
  const [openChildFunctionsModal, setOpenChildFunctionsModal] = useState(false); // Modal 3
  const [openChildrenModal, setOpenChildrenModal] = useState(false); // modal 2
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false); // modal 4

  const [childrenToDelete, setChildrenToDelete] = useState<ItemToRender[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [orgUnitFunctions, setOrgUnitFunctions] = useState<Function[]>([]); // Funktionen der Organisationseinheit
  const [childFunctions, setChildFunctions] = useState<
    { orgUnit: string; functions: Function[] }[]
  >([]); // Funktionen der Kinder

  const handleAdd = () => {
    setOpenCreateModal(true);
  };

  const handleDelete = async () => {
    // Prüfe, ob OrgUnit Funktionen hat
    if (await checkForFunctions(itemId)) {
      const functions = await fetchFunctionsByOrgUnit(itemId); // Funktionen abrufen
      setOrgUnitFunctions(functions);
      setOpenFunctionsModal(true); // Modal für Funktionen öffnen
      return;
    }

    // Sammle Kinder
    const childrenWithNames: ItemToRender[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        const items = child.props.itemsToRender || [];
        childrenWithNames.push(...items);
      }
    });
    setChildrenToDelete(childrenWithNames);

    // Nächster Schritt: handleNextStep() aufrufen
    handleNextStep();
  };

  const handleNextStep = async () => {
    // Prüfe, ob Kinder existieren
    const childrenWithNames: ItemToRender[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        const items = child.props.itemsToRender || [];
        // const descendants = collectAllDescendants(items); // Nachkommen sammeln
        // childrenWithNames.push(...descendants);
        childrenWithNames.push(...items);
      }
    });

    // Falls keine Funktionen vorhanden sind, prüfen wir die Nachkommen
    if (childrenWithNames.length > 0) {
      console.log('childrenWithNames', childrenWithNames);
      setChildrenToDelete(childrenWithNames); // Kinder speichern
      setOpenChildrenModal(true); // Modal für Kinder öffnen
      return;
    }

    // Nächster Schritt: handleNextStep() aufrufen
    handleNextStep2(childrenWithNames);
  };

  const handleNextStep2 = async (childrenWithNames: ItemToRender[]) => {
    // Prüfe, ob Kinder Funktionen haben
    const childrenWithFunctions =
      await checkChildrenForFunctions(childrenWithNames);

    if (childrenWithFunctions.length > 0) {
      setChildFunctions(childrenWithFunctions); // Funktionen der Kinder speichern
      setOpenChildFunctionsModal(true); // Modal 2 öffnen
      return;
    }

    handleFinalDelete();
  };

  const handleFinalDelete = async () => {
    // Kombiniere die Funktionen der Organisationseinheit und der Kinder
    const combinedFunctions = [
      { orgUnit: label as string, functions: orgUnitFunctions },
      ...childFunctions,
    ];
    setChildFunctions(combinedFunctions);

    // Setze das Modal mit den kombinierten Funktionen
    setOpenConfirmDeleteModal(true); // Bestätigungs-Modal öffnen
  };

  // Prüfe, ob Kinder oder deren Nachkommen Funktionen haben
  const checkChildrenForFunctions = async (children: ItemToRender[]) => {
    const results: { orgUnit: string; functions: Function[] }[] = [];

    for (const child of children) {
      console.log('child', child);
      // Prüfe die Funktionen des aktuellen Kindes
      const functions = await fetchFunctionsByOrgUnit(child.itemId);
      console.log('functions', functions);
      if (functions.length > 0) {
        results.push({ orgUnit: child.label, functions }); // Speichere label als Name
      }
      // Falls das Kind weitere Kinder hat, rekursiv prüfen
      if (child.children && child.children.length > 0) {
        const childResults = await checkChildrenForFunctions(child.children);
        results.push(...childResults); // Ergebnisse der Kinder hinzufügen
      }
    }
    console.log('results', results);
    return results;
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenEditModal(true); // Modal öffnen
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
          } as CustomLabelProps, // Typen explizit festlegen,
        }}
      />

      {/* Das ausgelagerte Modal für die Erstellung */}
      <CreateOrgUnitModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        parentId={itemId}
        refetch={refetch}
      />

      {/* Das ausgelagerte Modal für die Bearbeitung */}
      <EditOrgUnitModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        itemId={itemId}
        refetch={refetch}
      />

      <OrgUnitFunctionsModal
        open={openFunctionsModal}
        onClose={() => setOpenFunctionsModal(false)}
        functions={orgUnitFunctions}
        orgUnit={label as string}
        onContinue={() => {
          setOpenFunctionsModal(false);
          handleNextStep(); // Weiter zur nächsten Prüfung
        }}
      />

      {/* Bestätigungsdialog für das Löschen bei Kindern */}
      <ConfirmDeleteModal
        open={openChildrenModal}
        onClose={() => setOpenChildrenModal(false)}
        childrenToDelete={childrenToDelete}
        onConfirm={() => {
          setOpenChildrenModal(false);
          handleNextStep2(childrenToDelete); // Weiter zur nächsten Prüfung
        }} // Nach Bestätigung der Kinder, das Lösch-Modal für die Hauptorganisationseinheit öffnen
      />

      <ChildFunctionsModal
        open={openChildFunctionsModal}
        onClose={() => setOpenChildFunctionsModal(false)}
        childrenFunctions={childFunctions}
        onContinue={() => {
          setOpenChildFunctionsModal(false);
          handleFinalDelete(); // Weiter zur nächsten Prüfung
        }}
      />

      {/* Bestätigungsdialog für das Löschen */}
      <DeleteConfirmationModal
        open={openConfirmDeleteModal}
        onClose={() => setOpenConfirmDeleteModal(false)}
        onRemove={onRemove}
        itemId={itemId}
        childrenToDelete={childrenToDelete} // IDs rekursiv extrahieren
        functionList={childFunctions.flatMap((child) => child.functions)} // Funktionen der Kinder
        refetch={refetch}
      />
    </>
  );
});

export default CustomTreeItem;
