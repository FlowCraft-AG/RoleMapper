import { UserListProps } from "../../types/user.type";

export const UserList = ({ users, selectUser }: UserListProps) => {
  return (
    <ul className="list-group">
      {users.map((userId) => (
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
  );
};
