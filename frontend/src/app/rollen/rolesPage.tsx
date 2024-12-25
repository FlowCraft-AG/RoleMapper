'use client';

import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { GET_ROLES } from '../../graphql/queries/get-rollen';
import { client } from '../../lib/apolloClient';

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

export default function ClientRolesPage() {
  // Setze Anfangswerte für processId und userId
  const [processId, setProcessId] = useState('');
  const [userId, setUserId] = useState('');

  // Router-Hook für die Navigation verwenden
  const router = useRouter();

  // Initialisiere useLazyQuery für die Anfrage, die nur bei Button-Klick ausgeführt wird
  const [getRoles, { loading, error, data }] = useLazyQuery<
    GetProcessRolesData,
    GetProcessRolesVariables
  >(GET_ROLES, {
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
      alert(
        'Bitte geben Sie sowohl eine Process ID als auch eine User ID ein.',
      );
    }
  };

  // Wenn die Daten noch geladen werden
  if (loading) return <p>Loading...</p>;

  // Wenn ein Fehler auftritt
  if (error) {
    return (
      <div className="error-container text-center">
        <h2 className="text-danger">Fehler: {error.message}</h2>
        <button
          className="btn btn-danger mt-3"
          onClick={() => router.back()} // Mit `router.back()` geht es zurück zur vorherigen Seite
        >
          Zurück
        </button>
      </div>
    );
  }
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <form
        className="p-4 w-50 bg-white border border-primary rounded shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="display-6 mb-4 text-dark text-center">
          Rollen abfragen
        </h1>
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
        <div className="form-floating text-dark mb-4">
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
        <button type="submit" className="btn btn-danger w-100">
          Get Roles
        </button>

        {/* Anzeige der Rollen, wenn Daten vorhanden sind */}
        {data?.getProcessRoles.roles && (
          <div className="mt-4">
            {data.getProcessRoles.roles.length === 0 ? (
              <p className="text-center">
                Keine Rollen für die angegebene Process ID und User ID gefunden.
              </p>
            ) : (
              data.getProcessRoles.roles.map((role, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">{role.roleName}</h5>
                  </div>
                  <div className="card-body">
                    {role.users.length === 0 ? (
                      <p className="text-center">
                        Keine Benutzer für diese Rolle gefunden.
                      </p>
                    ) : (
                      <ul className="list-group">
                        {role.users.map((user, userIndex) => (
                          <li key={userIndex} className="list-group-item">
                            <strong>{user.functionName}</strong>:{' '}
                            <span className="text-muted">
                              {user.user.userId}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </form>
    </div>
  );
}
