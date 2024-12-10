'use client';

import { useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ORG_UNITS } from '../../graphql/queries/get-orgUnits';
import client from '../../lib/apolloClient';
import { JSX, useState } from 'react';

type OrgUnit = {
  _id: string;
  name: string;
  parentId: string | null;
  supervisor: string | null;
};


export default function OrgUnitsPage() {
  const { loading, error, data } = useQuery<{ getData: { data: OrgUnit[] } }>(ORG_UNITS, { client });

  // Zustand für geöffnete Einheiten
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Funktion zum Umschalten des geöffneten Zustands
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id], // Wechsel zwischen true/false
    }));
  };

  if (loading) return <div className="alert alert-info">Lade Daten...</div>;
  if (error) {
    console.error(error);
    return (
      <div className="alert alert-danger">
        Fehler: {error.message}. Bitte versuche es erneut!
      </div>
    );
  }

  const orgUnits = data?.getData?.data || [];

  // Rekursive Funktion zur Darstellung der Hierarchie
  const renderTree = (parentId: string | null): JSX.Element[] => {
    return orgUnits
      .filter((unit) => unit.parentId === parentId)
      .map((unit) => (
        <li key={unit._id} className="list-group-item">
          <div>
            <button
              className="btn btn-link p-0 me-2"
              onClick={() => toggleExpand(unit._id)} // Knoten öffnen/schließen 
           > 
              {expanded[unit._id] ? '▼' : '▶'} {/* Pfeil-Symbol hier */} 
            </button>
            <strong>{unit.name}</strong>
            {/* {unit.supervisor && <span> - Supervisor: {unit.supervisor}</span>} */}
          </div>
          {expanded[unit._id] && ( // Untergeordnete Elemente anzeigen, wenn geöffnet
            <ul className="list-group list-group-flush ms-4">
              {renderTree(unit._id)}
            </ul>
          )}
        </li>
      ));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Organisationseinheiten - Test</h1>
      <ul className="list-group w-25">{renderTree(null)}</ul>
    </div>
  );
}
