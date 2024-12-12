'use client';

import { useMutation, useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ADD_FUNCTIONS } from '../../graphql/mutations/add-to-function';
import { REMOVE_FUNCTIONS } from '../../graphql/mutations/remove-to-function';
import { FUNCTIONS } from '../../graphql/queries/get-functions';
import { ORG_UNITS } from '../../graphql/queries/get-orgUnits';
import { USERS } from '../../graphql/queries/get-users';
import client from '../../lib/apolloClient';
import { Function } from '../../types/function.type';
import { User } from '../../types/user.type';
import { OrgUnitList } from './(komponente)/OrgUnitList';
import { UserDetails } from './(komponente)/UserDetails';
import { UserList } from './(komponente)/UserList';

export default function OrgUnitsPage() {
  const {
    loading: loadingOrgUnits,
    error: errorOrgUnits,
    data: dataOrgUnits,
  } = useQuery(ORG_UNITS, { client });
  const {
    loading: loadingFunctions,
    error: errorFunctions,
    data: dataFunctions,
  } = useQuery(FUNCTIONS, { client });
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(USERS, { client });

  // Mutationen zum Hinzufügen und Entfernen von Benutzern
  const [addUserToFunction] = useMutation(ADD_FUNCTIONS, { client });
  const [removeUserFromFunction] = useMutation(REMOVE_FUNCTIONS, { client });
  const router = useRouter(); // Korrektur: router statt roueter

  const [expandedOrgUnits, setExpandedOrgUnits] = useState<
    Record<string, boolean>
  >({});
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filledCircles, setFilledCircles] = useState<Set<string>>(new Set());

  // States für das Modal und Entfernen von Benutzern
  const [showModal, setShowModal] = useState(false);
  const [userIdToAdd, setUserIdToAdd] = useState('');
  const [functionNameToAdd, setFunctionNameToAdd] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState('');
  const [functionNameToRemove, setFunctionNameToRemove] = useState('');

  const toggleExpandOrgUnit = (id: string) => {
    setExpandedOrgUnits((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCircle = (mandate: Function) => {
    setSelectedFunction(mandate._id === selectedFunction ? null : mandate._id);
    setFunctionNameToRemove(mandate.functionName);
    setSelectedUser(null);
    setFilledCircles((prev) => {
      const newSet = new Set<string>();
      if (mandate._id !== selectedFunction) {
        newSet.add(mandate._id);
      }
      return newSet;
    });
  };

  const selectUser = (userId: string) => {
    setSelectedUser((prevUser) =>
      prevUser && prevUser.userId === userId
        ? null
        : users.find((u) => u.userId === userId) || null,
    );
  };

  // Funktion zum Hinzufügen eines Benutzers zu einer Funktion
  const handleAddUserToFunction = () => {
    addUserToFunction({
      variables: { functionName: functionNameToAdd, userId: userIdToAdd },
    })
      .then(() => {
        console.log(
          `Benutzer ${userIdToAdd} wurde zu Funktion ${functionNameToAdd} hinzugefügt`,
        );
        setUserIdToAdd('');
        setFunctionNameToAdd('');
        setShowModal(false); // Modal schließen
        // Cache zurücksetzen, damit die Abfragen beim Refresh die neuesten Daten holen
        client.cache.reset();
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Benutzers:', error);
      });
  };

  // Funktion zum Entfernen eines Benutzers von einer Funktion
  const handleRemoveUserFromFunction = () => {
    removeUserFromFunction({
      variables: { functionName: functionNameToRemove, userId: userIdToRemove },
    })
      .then(() => {
        console.log(`Benutzer ${userIdToRemove} wurde von Funktion entfernt`);
        setShowRemoveConfirm(false); // Bestätigungsdialog schließen
        // Cache zurücksetzen, damit die Abfragen beim Refresh die neuesten Daten holen
        client.cache.reset();
      })
      .catch((error) => {
        console.error('Fehler beim Entfernen des Benutzers:', error);
      });
  };

  if (loadingOrgUnits || loadingFunctions || loadingUsers)
    return <div className="alert alert-info">Lade Daten...</div>;
  if (errorOrgUnits || errorFunctions || errorUsers) {
    console.error(errorOrgUnits || errorFunctions || errorUsers);
    return (
      <div className="alert alert-danger">
        Fehler:{' '}
        {errorOrgUnits?.message ||
          errorFunctions?.message ||
          errorUsers?.message}
        . Bitte versuche es erneut!
      </div>
    );
  }

  const orgUnits = dataOrgUnits?.getData?.data || [];
  const functions = dataFunctions?.getData?.data || [];
  const users = dataUsers?.getData?.data || [];

  const functionsByOrgUnit = functions.reduce(
    (acc, func) => {
      if (!acc[func.orgUnit]) acc[func.orgUnit] = [];
      acc[func.orgUnit].push(func);
      return acc;
    },
    {} as Record<string, Function[]>,
  );

  return (
    <div className="container mt-4">
      {/* Container für Titel und Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Organisationseinheiten und Funktionen</h1>
        {/* Button für das Modal */}
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ADD to Function
        </button>
      </div>

      <div className="d-flex">
        {/* Linke Seite für Organisationseinheiten und Funktionen */}
        <OrgUnitList
          orgUnits={orgUnits}
          functionsByOrgUnit={functionsByOrgUnit}
          expandedOrgUnits={expandedOrgUnits}
          toggleExpandOrgUnit={toggleExpandOrgUnit}
          toggleCircle={toggleCircle}
          filledCircles={filledCircles}
        />
        {/* Rechte Seite für die Details der ausgewählten Funktion */}
        {selectedFunction && (
          <div className="ms-4 w-50">
            <h3>Benutzer der Funktion</h3>
            <UserList
              users={
                functions.find((func) => func._id === selectedFunction)
                  ?.users || []
              }
              selectUser={selectUser}
              handleAddUserToFunction={handleAddUserToFunction} // Funktion zum Hinzufügen
              handleRemoveUserFromFunction={handleRemoveUserFromFunction} // Funktion zum Entfernen
              setShowModal={setShowModal} // Funktion zum Öffnen des Modals
              setUserIdToAdd={setUserIdToAdd}
              setFunctionNameToAdd={setFunctionNameToAdd}
              setShowRemoveConfirm={setShowRemoveConfirm}
              setUserIdToRemove={setUserIdToRemove} // Übergebe setUserIdToRemove hier
            />
          </div>
        )}
        {/* Rechte Seite für die Details des ausgewählten Benutzers */}
        {selectedUser && <UserDetails user={selectedUser} />}
      </div>

      {/* Modal zum Hinzufügen eines Benutzers */}
      <div
        className={`modal ${showModal ? 'show' : ''}`}
        tabIndex={-1}
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Benutzer zu Funktion hinzufügen</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Funktion auswählen</label>
                <select
                  className="form-select"
                  value={functionNameToAdd}
                  onChange={(e) => setFunctionNameToAdd(e.target.value)}
                >
                  <option value="" disabled selected>
                    Wähle eine Funktion
                  </option>
                  {functions.map((func) => (
                    <option key={func._id} value={func.functionName}>
                      {func.functionName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Benutzer-ID eingeben</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="IZ-Kürzel"
                  value={userIdToAdd}
                  onChange={(e) => setUserIdToAdd(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Abbrechen
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddUserToFunction}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bestätigungsmodal zum Entfernen eines Benutzers */}
      <div
        className={`modal ${showRemoveConfirm ? 'show' : ''}`}
        tabIndex={-1}
        style={{ display: showRemoveConfirm ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Benutzer entfernen</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowRemoveConfirm(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Willst du den {userIdToRemove} wirklich von der Funktion "
                {functionNameToRemove}" entfernen?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRemoveConfirm(false)}
              >
                Abbrechen
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRemoveUserFromFunction}
              >
                Entfernen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
