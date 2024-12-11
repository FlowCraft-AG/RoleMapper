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
