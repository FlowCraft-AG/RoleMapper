import { FunctionString } from '../types/function.type';
import { ShortOrgUnit } from '../types/orgUnit.type';

/**
 * Erzeugt einen anzeigbaren Namen für Organisationseinheiten.
 *
 * @function buildDisplayName
 * @param {ShortOrgUnit} unit - Die Organisationseinheit.
 * @param {Map<string, ShortOrgUnit>} orgUnitsMap - Eine Map aller Organisationseinheiten.
 * @returns {string} Der anzeigbare Name.
 */
export const buildOrgUnitDisplayName = (
  unit: { name: string; parentId?: string },
  orgUnitsMap: Map<string, { name: string; parentId?: string }>,
): string => {
  const parent = unit.parentId ? orgUnitsMap.get(unit.parentId) : undefined;
  const grandParent = parent?.parentId
    ? orgUnitsMap.get(parent.parentId)
    : undefined;

  // Sonderfall: Wenn der Parent "Hochschule" ist, zeige nur den Namen des Kindes
  if (parent?.name === 'Hochschule') {
    return unit.name;
  }

  // Fall: Es gibt sowohl einen Parent als auch einen Grandparent
  if (parent && grandParent) {
    return `${unit.name} (${grandParent.name}, ${parent.name})`;
  }

  // Fall: Es gibt nur einen Parent
  if (parent) {
    return `${unit.name} (${parent.name})`;
  }

  // Fallback: Nur der Name des aktuellen Knotens
  return unit.name;
};

/**
 * Erzeugt einen anzeigbaren Namen für eine Funktion.
 *
 * @function buildFunctionDisplayName
 * @param {FunctionString} func - Die Funktion.
 * @param {Map<string, { name: string; parentId?: string }>} orgUnitsMap - Eine Map aller Organisationseinheiten.
 * @returns {string} Der anzeigbare Name.
 */
export const buildFunctionDisplayName = (
  func: FunctionString,
  orgUnitsMap: Map<string, { name: string; parentId?: string }>,
): string => {
  // Finde die Organisationseinheit der Funktion
  const orgUnit = orgUnitsMap.get(func.orgUnit);

  // Kein orgUnit vorhanden
  if (!orgUnit) {
    return func.functionName;
  }

  // Rekursiv den Namen der Organisationseinheit erstellen
  const orgUnitDisplayName = buildDisplayName(orgUnit, orgUnitsMap);

  // Funktion und Organisationseinheit kombinieren
  return `${func.functionName} (${orgUnitDisplayName})`;
};

const buildDisplayName = (
  unit: { name: string; parentId?: string },
  orgUnitsMap: Map<string, { name: string; parentId?: string }>,
): string => {
  const parent = unit.parentId ? orgUnitsMap.get(unit.parentId) : undefined;
  const grandParent = parent?.parentId
    ? orgUnitsMap.get(parent.parentId)
    : undefined;

  // Sonderfall: Wenn der Parent "Hochschule" ist, zeige nur den Namen des Kindes
  if (parent?.name === 'Hochschule') {
    return unit.name;
  }

  // Fall: Es gibt sowohl einen Parent als auch einen Grandparent
  if (parent && grandParent) {
    return `(${unit.name}) (${grandParent.name}, ${parent.name})`;
  }

  // Fall: Es gibt nur einen Parent
  if (parent) {
    return `${unit.name} (${parent.name})`;
  }

  // Fallback: Nur der Name des aktuellen Knotens
  return unit.name;
};
