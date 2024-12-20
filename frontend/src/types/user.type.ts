export type User = {
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

export type UserDetailsProps = {
  user: User;
};

export type UserListProps = {
  users: string[];
  selectUser: (userId: string) => void;
};

export type UserCredetials = {
  userId: string;
  _id: string;
};

// Beispiel für das User Enum
export enum UserEnum {
    UserId = 'userId',  // Attribut
    UserType = 'userType',  // Enum-Wert
    UserRole = 'userRole',  // Enum-Wert
    OrgUnit = 'orgUnit',
    Active = 'active',
    ValidFrom = 'validFrom',
    ValidUntil = 'validUntil',
    Employee = 'employee',
    CostCenter = 'costCenter',
    Department = 'department',
    Student = 'student',
    CourseOfStudy = 'courseOfStudy',
    CourseOfStudyUnique = 'courseOfStudyUnique',
    CourseOfStudyShort = 'courseOfStudyShort',
    CourseOfStudyName = 'courseOfStudyName',
    Level = 'level',
    ExamRegulation = 'examRegulation',
}

// Extrahiert die Enum-Werte
export const getEnumValues = (): string[] => {
    return Object.values(UserEnum).filter(value => typeof value === 'string') as string[];
};
