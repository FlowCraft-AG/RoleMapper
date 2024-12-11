import { UserDetailsProps } from '../../types/user.type';

export const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <div className="bg-light p-4 rounded border">
      <h5>Benutzerdetails</h5>
      <div className="mb-3">
        <strong>ID:</strong> {user._id}
      </div>
      <div className="mb-3">
        <strong>Benutzer-ID:</strong> {user.userId}
      </div>
      <div className="mb-3">
        <strong>Benutzertyp:</strong> {user.userType}
      </div>
      <div className="mb-3">
        <strong>Rolle:</strong> {user.userRole}
      </div>
      <div className="mb-3">
        <strong>Organisationseinheit:</strong> {user.orgUnit}
      </div>
      <div className="mb-3">
        <strong>Aktiv:</strong> {user.active ? 'Ja' : 'Nein'}
      </div>
      <div className="mb-3">
        <strong>Gültig von:</strong>{' '}
        {new Date(Number(user.validFrom)).toLocaleString()}
      </div>
      <div className="mb-3">
        <strong>Gültig bis:</strong>{' '}
        {new Date(Number(user.validUntil)).toLocaleString()}
      </div>

      {user.userType === 'student' && user.student && (
        <>
          <h5>Studierendendetails</h5>
          <div className="mb-3">
            <strong>Kursname:</strong> {user.student.courseOfStudyName}
          </div>
          <div className="mb-3">
            <strong>Studiengang:</strong> {user.student.courseOfStudy}
          </div>
          <div className="mb-3">
            <strong>Level:</strong> {user.student.level}
          </div>
          <div className="mb-3">
            <strong>Prüfungsordnung:</strong> {user.student.examRegulation}
          </div>
        </>
      )}

      {user.userType === 'employee' && user.employee && (
        <>
          <h5>Angestelltendetails</h5>
          <div className="mb-3">
            <strong>Kostenstelle:</strong> {user.employee.costCenter}
          </div>
          <div className="mb-3">
            <strong>Abteilung:</strong> {user.employee.department}
          </div>
        </>
      )}
    </div>
  );
};
