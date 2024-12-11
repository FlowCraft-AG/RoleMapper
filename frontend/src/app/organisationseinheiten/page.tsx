'use client';

import { useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { FUNCTIONS } from '../../graphql/queries/get-functions';
import { ORG_UNITS } from '../../graphql/queries/get-orgUnits';
import { USERS } from '../../graphql/queries/get-users';
import client from '../../lib/apolloClient';
import { Function } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { User } from '../../types/user.type';
import { OrgUnitList } from './OrgUnitList'; // Import der OrgUnitList-Komponente
import { UserDetails } from './UserDetails'; // Import der UserDetails-Komponente
import { UserList } from './UserList'; // Import der UserList-Komponente

export default function OrgUnitsPage() {
  const {
    loading: loadingOrgUnits,
    error: errorOrgUnits,
    data: dataOrgUnits,
  } = useQuery<{ getData: { data: OrgUnit[] } }>(ORG_UNITS, { client });
  const {
    loading: loadingFunctions,
    error: errorFunctions,
    data: dataFunctions,
  } = useQuery<{ getData: { data: Function[] } }>(FUNCTIONS, { client });
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery<{ getData: { data: User[] } }>(USERS, { client });

  const [expandedOrgUnits, setExpandedOrgUnits] = useState<
    Record<string, boolean>
  >({});
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filledCircles, setFilledCircles] = useState<Set<string>>(new Set());

  const toggleExpandOrgUnit = (id: string) => {
    setExpandedOrgUnits((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCircle = (functionId: string) => {
    setSelectedFunction(functionId === selectedFunction ? null : functionId);
    setSelectedUser(null);
    setFilledCircles((prev) => {
      const newSet = new Set<string>();
      if (functionId !== selectedFunction) {
        newSet.add(functionId);
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
      <h1 className="mb-4">Organisationseinheiten und Funktionen</h1>
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
            />
          </div>
        )}
        {/* Rechte Seite für die Details des ausgewählten Benutzers */}
        {selectedUser && <UserDetails user={selectedUser} />}
      </div>
    </div>
  );
}
