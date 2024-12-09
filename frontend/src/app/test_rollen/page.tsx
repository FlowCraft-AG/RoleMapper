'use client'

import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ROLES } from '../../graphql/queries/get-rollen';
import client from '../../lib/apolloClient';
import { useRouter } from 'next/navigation';

// Definiere Typen für die Antwortdaten
interface User {
  functionName: string;
  user: {
    userId: string;
  };
}

interface Role {
  roleName: string;
  users: User[];
}

interface GetProcessRolesData {
  getProcessRoles: {
    roles: Role[];
  };
}

// Definiere Typen für die Variablen
interface GetProcessRolesVariables {
  processId: string;
  userId: string;
}

export default function RolesPage() {
  // Setze Anfangswerte für processId und userId
  const [processId, setProcessId] = useState('');
  const [userId, setUserId] = useState('');

  // Router-Hook für die Navigation verwenden
  const router = useRouter();

  // Initialisiere useLazyQuery für die Anfrage, die nur bei Button-Klick ausgeführt wird
  const [getRoles, { loading, error, data }] = useLazyQuery<GetProcessRolesData, GetProcessRolesVariables>(GET_ROLES, {
    client,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'userId') {
      setUserId(value);
    } else if (name === 'processId') {
      setProcessId(value);
    }
  };

  // Funktion zum Handhaben der Formulareingabe
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (processId && userId) {
      // Anfrage nur bei validen Eingaben ausführen
      getRoles({ variables: { processId, userId } });
    } else {
      alert('Bitte geben Sie sowohl eine Process ID als auch eine User ID ein.');
    }
  };

  // Wenn die Daten noch geladen werden
  if (loading) return <p>Loading...</p>;

  // Wenn ein Fehler auftritt
  if (error) {
    return (
      <div className="error-container">
        <h2 className="text-danger">Fehler: {error.message}</h2>
        <button
          className="btn btn-danger mt-3"
          onClick={() => router.back()}  // Mit `router.back()` geht es zurück zur vorherigen Seite
        >
          Zurück
        </button>
      </div>
    );
  }

  return (
    <form className="p-3 w-50 bg-white border border-danger rounded shadow" onSubmit={handleSubmit}>
      <h1 className="display-6 mb-3 text-dark">Rollen</h1>
      <div className="form-floating mb-3 text-dark">
        <input
          type="text"
          className="form-control"
          id="floatingUserId"
          placeholder="muud0001"
          name="userId"
          value={userId}
          onChange={handleChange}
          required
        />
        <label htmlFor="floatingUserId">User ID</label>
      </div>
      <div className="form-floating text-dark">
        <input
          type="text"
          className="form-control"
          id="floatingProcessId"
          placeholder="DA0001"
          name="processId"
          value={processId}
          onChange={handleChange}
          required
        />
        <label htmlFor="floatingProcessId">Process ID</label>
      </div>
      <button type="submit" className="btn btn-danger mt-3">
        Get Roles
      </button>

      {/* Anzeige der Rollen, wenn Daten vorhanden sind */}
      {data?.getProcessRoles.roles && (
        <div>
          {data.getProcessRoles.roles.length === 0 ? (
            <p>No roles found for the given Process ID and User ID.</p>
          ) : (
            data.getProcessRoles.roles.map((role, index) => (
              <div key={index}>
                <h2>{role.roleName}</h2>
                <ul>
                  {role.users.map((user, userIndex) => (
                    <li key={userIndex}>
                      <strong>{user.functionName}</strong>: {user.user.userId}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </form>
  );
}
