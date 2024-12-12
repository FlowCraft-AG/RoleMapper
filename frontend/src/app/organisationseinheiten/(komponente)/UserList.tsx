import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type UserListProps = {
  users: string[]; // Liste der Benutzer-IDs
  selectUser: (userId: string) => void; // Funktion zum Auswählen eines Benutzers
  handleAddUserToFunction: (functionName: string, userId: string) => void; // Funktion zum Hinzufügen eines Benutzers
  handleRemoveUserFromFunction: (functionName: string, userId: string) => void; // Funktion zum Entfernen eines Benutzers
  setShowModal: (show: boolean) => void; // Funktion zum Öffnen des Modals
  setUserIdToAdd: (id: string) => void; // Funktion zum Setzen der Benutzer-ID für das Hinzufügen
  setFunctionNameToAdd: (name: string) => void; // Funktion zum Setzen des Funktionsnamens für das Hinzufügen
  setShowRemoveConfirm: (show: boolean) => void; // Funktion zum Öffnen des Bestätigungsdialogs
  setUserIdToRemove: (id: string) => void; // Funktion zum Setzen der Benutzer-ID für das Entfernen
};

export const UserList = ({
  users,
  selectUser,
  setShowRemoveConfirm,
  setUserIdToRemove,
}: UserListProps) => {
  return (
    <ul className="list-group">
      {users.map((userId) => (
        <li
          key={userId}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {/* Benutzer-ID und On-Click Event */}
          <span onClick={() => selectUser(userId)}>{userId}</span>

          {/* Button zum Entfernen */}
          <div>
            {/* Rotes Kreuz zum Entfernen */}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                setUserIdToRemove(userId); // Setze die Benutzer-ID zum Entfernen
                setShowRemoveConfirm(true); // Zeige den Bestätigungsdialog an
              }}
            >
              <FontAwesomeIcon icon={faTimes} />{' '}
              {/* FontAwesome Icon für das rote Kreuz */}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
