type UserListProps = {
  users: string[];
  selectUser: (userId: string) => void;
};

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
