import { JSX } from 'react';
import { FunctionList } from './FunctionList';
import { OrgUnitListProps } from '../../types/orgUnit.type';

export const OrgUnitList = ({
  orgUnits,
  functionsByOrgUnit,
  expandedOrgUnits,
  toggleExpandOrgUnit,
  toggleCircle,
  filledCircles,
}: OrgUnitListProps) => {
  // Filtern der obersten Organisationseinheiten (parentId: null)
  const topLevelOrgUnits = orgUnits.filter((unit) => unit.parentId === null);

  // Rekursive Funktion zur Anzeige der untergeordneten Einheiten
  const renderSubUnits = (parentId: string | null): JSX.Element[] => {
    return orgUnits
      .filter((unit) => unit.parentId === parentId)
      .map((unit) => {
        const unitFunctions = functionsByOrgUnit[unit._id] || [];

        return (
          <li key={unit._id} className="list-group-item">
            <div>
              <button
                className="btn btn-link p-0 me-2"
                onClick={() => toggleExpandOrgUnit(unit._id)} // Knoten öffnen/schließen
              >
                {expandedOrgUnits[unit._id] ? '▼' : '▶'}
              </button>
              <strong>{unit.name}</strong>
              {expandedOrgUnits[unit._id] && unitFunctions.length > 0 && (
                <FunctionList
                  functions={unitFunctions}
                  toggleCircle={toggleCircle}
                  filledCircles={filledCircles}
                />
              )}
            </div>
            {expandedOrgUnits[unit._id] && (
              <ul className="list-group list-group-flush ms-4">
                {/* Rekursive Anzeige der untergeordneten Einheiten */}
                {renderSubUnits(unit._id)}
              </ul>
            )}
          </li>
        );
      });
  };

  return (
    <ul className="list-group w-50">
      {topLevelOrgUnits.map((unit) => {
        const unitFunctions = functionsByOrgUnit[unit._id] || [];

        return (
          <li key={unit._id} className="list-group-item">
            <div>
              <button
                className="btn btn-link p-0 me-2"
                onClick={() => toggleExpandOrgUnit(unit._id)} // Knoten öffnen/schließen
              >
                {expandedOrgUnits[unit._id] ? '▼' : '▶'}
              </button>
              <strong>{unit.name}</strong>
              {expandedOrgUnits[unit._id] && unitFunctions.length > 0 && (
                <FunctionList
                  functions={unitFunctions}
                  toggleCircle={toggleCircle}
                  filledCircles={filledCircles}
                />
              )}
            </div>
            {expandedOrgUnits[unit._id] && (
              <ul className="list-group list-group-flush ms-4">
                {/* Rekursive Anzeige der untergeordneten Einheiten */}
                {renderSubUnits(unit._id)}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};
