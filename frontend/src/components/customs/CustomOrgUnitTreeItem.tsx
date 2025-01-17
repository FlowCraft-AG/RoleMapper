/**
 * @file CustomTreeItem.tsx
 * @description Eine erweiterte TreeItem-Komponente zur Darstellung von Organisationseinheiten mit integrierten Aktionen
 * wie Hinzufügen, Bearbeiten und Löschen. Unterstützt komplexe Prüfungen auf abhängige Funktionen und Kinder.
 *
 * @module CustomTreeItem
 */

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
} from '../../lib/api/rolemapper/function.api';
import { StyledTreeItem } from '../../styles/StyleTreeItem';
import { FunctionString } from '../../types/function.type';
import OrgUnitFunctionsModal from '../modal/orgUnitModals/ConfirmOrgUnitDeleteModal1';
import ConfirmDeleteModal from '../modal/orgUnitModals/ConfirmOrgUnitDeleteModal2';
import ChildFunctionsModal from '../modal/orgUnitModals/ConfirmOrgUnitDeleteModal3';
import CreateOrgUnitModal from '../modal/orgUnitModals/CreateOrgUnitModal';
import DeleteConfirmationModal from '../modal/orgUnitModals/DeleteConfirmedOrgUnitModal'; // Importiere das ausgelagerte Delete-Modal
import EditOrgUnitModal from '../modal/orgUnitModals/EditOrgUnitModal';
import { CustomLabel, CustomLabelProps } from './CustomOrgUnitLabel';

/**
 * Interface für die Darstellung eines zu rendernden Items.
 *
 * @interface ItemToRender
 * @property {string} label - Die Bezeichnung des Items.
 * @property {string} itemId - Die eindeutige ID des Items.
 * @property {string} [id] - Optionale ID des Items.
 * @property {ItemToRender[]} [children] - Verschachtelte Kinder des Items.
 */
export interface ItemToRender {
  label: string;
  itemId: string;
  id?: string; // Kann undefined sein
  children?: ItemToRender[]; // Rekursive Definition für verschachtelte Kinder
}

interface ChildProp {
  itemsToRender?: ItemToRender[]; // Optional, falls es fehlen könnte
}

/**
 * Props für die `CustomTreeItem`-Komponente.
 *
 * @interface CustomTreeItemProps
 * @extends TreeItem2Props
 * @property {function} onRemove - Callback-Funktion, die aufgerufen wird, wenn ein Item entfernt wird.
 * @property {function} refetch - Callback-Funktion, um die Daten zu aktualisieren.
 * @property {ReactElement<ChildProp>[] | ReactElement<ChildProp>} [children] - Verschachtelte Organisationseinheiten.
 */
interface CustomTreeItemProps extends TreeItem2Props {
  onRemove: (ids: string[]) => void; // Übergibt ein Array von IDs
  refetch: () => Promise<void>; // Die refetch-Methode
  children?: ReactElement<ChildProp>[] | ReactElement<ChildProp>; // Optional, falls es verschachtelte Organisationseinheiten gibt
}

/**
 * `CustomTreeItem`-Komponente
 *
 * Diese Komponente erweitert die Funktionalität von TreeItem, indem sie Aktionen wie Hinzufügen, Bearbeiten und Löschen
 * integriert. Sie führt auch Prüfungen auf abhängige Funktionen und Kinder durch.
 *
 * @component
 * @param {CustomTreeItemProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des benutzerdefinierten TreeItems.
 *
 * @example
 * <CustomTreeItem
 *   itemId="1"
 *   label="Fakultät A"
 *   onRemove={(ids) => console.log('Entfernte IDs:', ids)}
 *   refetch={async () => console.log('Daten aktualisieren')}
 * />
 */
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

  const [orgUnitFunctions, setOrgUnitFunctions] = useState<FunctionString[]>(
    [],
  ); // Funktionen der Organisationseinheit
  const [childFunctions, setChildFunctions] = useState<
    { orgUnit: string; functions: FunctionString[] }[]
  >([]); // Funktionen der Kinder

  /**
   * Öffnet das Modal zum Erstellen einer Organisationseinheit.
   *
   * @function handleAdd
   */
  const handleAdd = () => {
    setOpenCreateModal(true);
  };

  /**
   * Prüft und verwaltet den Löschprozess einer Organisationseinheit.
   *
   * @function handleDelete
   */
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

  /**
   * Führt den nächsten Schritt im Löschprozess durch.
   *
   * @function handleNextStep
   */
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
      setChildrenToDelete(childrenWithNames); // Kinder speichern
      setOpenChildrenModal(true); // Modal für Kinder öffnen
      return;
    }

    // Nächster Schritt: handleNextStep() aufrufen
    handleNextStep2(childrenWithNames);
  };

  /**
   * Prüft auf abhängige Funktionen von Kindern und führt den nächsten Schritt durch.
   *
   * @function handleNextStep2
   * @param {ItemToRender[]} childrenWithNames - Die Kinder der aktuellen Organisationseinheit.
   */
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

  /**
   * Führt den endgültigen Löschprozess durch.
   *
   * @function handleFinalDelete
   */
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
    const results: { orgUnit: string; functions: FunctionString[] }[] = [];

    for (const child of children) {
      // Prüfe die Funktionen des aktuellen Kindes
      const functions = await fetchFunctionsByOrgUnit(child.itemId);
      if (functions.length > 0) {
        results.push({ orgUnit: child.label, functions }); // Speichere label als Name
      }
      // Falls das Kind weitere Kinder hat, rekursiv prüfen
      if (child.children && child.children.length > 0) {
        const childResults = await checkChildrenForFunctions(child.children);
        results.push(...childResults); // Ergebnisse der Kinder hinzufügen
      }
    }
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
