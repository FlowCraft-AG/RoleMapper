'use client';

import { useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ORG_UNITS } from '../../graphql/queries/get-orgUnits';
import { FUNCTIONS } from '../../graphql/queries/get-functions'; // Deine aktualisierte Funktionen-Query
import { USERS } from '../../graphql/queries/get-users'; // Neue Abfrage, um Benutzer zu erhalten
import client from '../../lib/apolloClient';
import { JSX, useState } from 'react';

type OrgUnit = {
  _id: string;
  name: string;
  parentId: string | null;
  supervisor: string | null;
};

type Function = {
  _id: string;
  functionName: string;
  users: string[];
  orgUnit: string;
  type: string | null;
};

type User = {
  _id: string;
  userId: string;
  userType: string;
  userRole: string;
  orgUnit: string;
  active: boolean;
  validFrom: string;
  validUntil: string;
  employee?: {
    costCenter: string;
    department: string;
  };
  student?: {
    _id: string;
    courseOfStudy: string;
    courseOfStudyUnique: string;
    courseOfStudyShort: string;
    courseOfStudyName: string;
    level: string;
    examRegulation: string;
  };
};

export default function OrgUnitsPage() {
  const { loading: loadingOrgUnits, error: errorOrgUnits, data: dataOrgUnits } = useQuery<{ getData: { data: OrgUnit[] } }>(ORG_UNITS, { client });
  const { loading: loadingFunctions, error: errorFunctions, data: dataFunctions } = useQuery<{ getData: { data: Function[] } }>(FUNCTIONS, { client });
  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery<{ getData: { data: User[] } }>(USERS, { client });

  const [expandedOrgUnits, setExpandedOrgUnits] = useState<Record<string, boolean>>({}); // Zustand für jede OrgUnit
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null); // Die ID der ausgewählten Funktion
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Die ID des ausgewählten Benutzers
  const [filledCircles, setFilledCircles] = useState<Set<string>>(new Set()); // Set für die gefüllten Kreise

  // Funktion zum Umschalten des geöffneten Zustands der OrgUnit
  const toggleExpandOrgUnit = (id: string) => {
    setExpandedOrgUnits((prev) => ({
      ...prev,
      [id]: !prev[id], // Wechsel zwischen true/false
    }));
  };

  // Funktion zum Auswählen einer Funktion und Füllen des Kreises
  const toggleCircle = (functionId: string) => {
    // Wenn eine neue Funktion angeklickt wird, wähle sie aus und entferne die vorherige Auswahl
    setSelectedFunction(functionId === selectedFunction ? null : functionId); // Toggle der Funktion
    setSelectedUser(null); // Entferne die Auswahl des Benutzers

    // Zurücksetzen der gefüllten Kreise
    setFilledCircles((prev) => {
      const newSet = new Set<string>();
      if (functionId !== selectedFunction) {
        newSet.add(functionId);
      }
      return newSet; // Nur den aktuellen Kreis behalten
    });
  };

  // Funktion zum Auswählen eines Benutzers
  const selectUser = (userId: string) => {
    // Wenn ein Benutzer angeklickt wird, wähle ihn aus und entferne die Auswahl der Funktion
    setSelectedUser((prevUser) => (prevUser && prevUser.userId === userId ? null : users.find((u) => u.userId === userId) || null));
    // Beim Klicken auf einen Benutzer nicht die Funktion entfernen
  };

  if (loadingOrgUnits || loadingFunctions || loadingUsers) return <div className="alert alert-info">Lade Daten...</div>;
  if (errorOrgUnits || errorFunctions || errorUsers) {
    console.error(errorOrgUnits || errorFunctions || errorUsers);
    return (
      <div className="alert alert-danger">
        Fehler: {errorOrgUnits?.message || errorFunctions?.message || errorUsers?.message}. Bitte versuche es erneut!
      </div>
    );
  }

  const orgUnits = dataOrgUnits?.getData?.data || [];
  const functions = dataFunctions?.getData?.data || [];
  const users = dataUsers?.getData?.data || [];

  // Funktionen nach Organisationseinheit gruppieren
  const functionsByOrgUnit = functions.reduce((acc, func) => {
    if (!acc[func.orgUnit]) acc[func.orgUnit] = [];
    acc[func.orgUnit].push(func);
    return acc;
  }, {} as Record<string, Function[]>);

  // Rekursive Funktion zur Darstellung der Hierarchie
  const renderTree = (parentId: string | null): JSX.Element[] => {
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
                {expandedOrgUnits[unit._id] ? '▼' : '▶'} {/* Dreieck für OrgUnits */}
              </button>
              <strong>{unit.name}</strong>
              {/* Funktionen der OrgUnit */}
              {expandedOrgUnits[unit._id] && unitFunctions.length > 0 && (
                <ul className="list-group list-group-flush ms-4">
                  {unitFunctions.map((func) => (
                    <li
                      key={func._id}
                      className="list-group-item d-flex align-items-center"
                      onClick={() => toggleCircle(func._id)} // Funktion klicken
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className={`circle-icon me-2 ${filledCircles.has(func._id) ? 'bg-primary' : 'border'}`}
                      ></div> {/* Leerer Kreis, der beim Klicken gefüllt wird */}
                      <span>{func.functionName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {expandedOrgUnits[unit._id] && ( // Untergeordnete Elemente anzeigen, wenn geöffnet
              <ul className="list-group list-group-flush ms-4">
                {renderTree(unit._id)}
              </ul>
            )}
          </li>
        );
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Organisationseinheiten und Funktionen</h1>
      <div className="d-flex">
        {/* Linke Seite für Organisationseinheiten und Funktionen */}
        <ul className="list-group w-50">{renderTree(null)}</ul>

        {/* Rechte Seite für die Details der ausgewählten Funktion */}
        {selectedFunction && (
          <div className="ms-4 w-50">
            <h3>Benutzer der Funktion</h3>
            <ul className="list-group">
              {functions
                .find((func) => func._id === selectedFunction)
                ?.users.map((userId) => (
                  <li
                    key={userId}
                    className="list-group-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => selectUser(userId)} // Benutzer-ID klicken
                  >
                    {userId}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Rechte Seite für die Details des ausgewählten Benutzers */}
        {selectedUser && (
          <div className="ms-4 w-50">
            <h3>Details des Benutzers</h3>
            <div className="bg-light p-4 rounded border">
              <h5>Benutzerdetails</h5>
              <div className="mb-3">
                <strong>ID:</strong> {selectedUser._id}
              </div>
              <div className="mb-3">
                <strong>Benutzer-ID:</strong> {selectedUser.userId}
              </div>
              <div className="mb-3">
                <strong>Benutzertyp:</strong> {selectedUser.userType}
              </div>
              <div className="mb-3">
                <strong>Rolle:</strong> {selectedUser.userRole}
              </div>
              <div className="mb-3">
                <strong>Organisationseinheit:</strong> {selectedUser.orgUnit}
              </div>
              <div className="mb-3">
                <strong>Aktiv:</strong> {selectedUser.active ? 'Ja' : 'Nein'}
              </div>
              <div className="mb-3">
                <strong>Gültig von:</strong> {new Date(Number(selectedUser.validFrom)).toLocaleString()}
              </div>
              <div className="mb-3">
                <strong>Gültig bis:</strong> {new Date(Number(selectedUser.validUntil)).toLocaleString()}
              </div>

              {/* Zusätzliche Details basierend auf dem userType */}
              {selectedUser.userType === 'student' && selectedUser.student && (
                <>
                  <h5>Studierendendetails</h5>
                  <div className="mb-3">
                    <strong>Kursname:</strong> {selectedUser.student.courseOfStudyName}
                  </div>
                  <div className="mb-3">
                    <strong>Studiengang:</strong> {selectedUser.student.courseOfStudy}
                  </div>
                  <div className="mb-3">
                    <strong>Level:</strong> {selectedUser.student.level}
                  </div>
                  <div className="mb-3">
                    <strong>Prüfungsordnung:</strong> {selectedUser.student.examRegulation}
                  </div>
                </>
              )}

              {selectedUser.userType === 'employee' && selectedUser.employee && (
                <>
                  <h5>Angestelltendetails</h5>
                  <div className="mb-3">
                    <strong>Kostenstelle:</strong> {selectedUser.employee.costCenter}
                  </div>
                  <div className="mb-3">
                    <strong>Abteilung:</strong> {selectedUser.employee.department}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
