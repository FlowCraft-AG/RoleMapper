'use client';

import { useQuery, gql } from '@apollo/client';

interface OrgUnit {
  _id: string;
  name: string;
  parentId: string | null;
  supervisor: string;
}

const GET_ORG_UNITS = gql`
  query GetOrgUnits {
    getData(entity: ORG_UNITS) 
  }
`;

export default function OrgUnits() {
  const { loading, error, data } = useQuery<{ getData: OrgUnit[] }>(GET_ORG_UNITS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const renderOrgUnits = (units: OrgUnit[], parentId: string | null = null) => {
    return units
      .filter((unit) => unit.parentId === parentId)
      .map((unit) => (
        <li key={unit._id}>
          <strong>{unit.name}</strong>
          {unit.supervisor && <p>Supervisor: {unit.supervisor}</p>}
          <ul>{renderOrgUnits(units, unit._id)}</ul>
        </li>
      ));
  };

  return (
    <div>
      <h1>Organisationseinheiten</h1>
      <ul>{renderOrgUnits(data?.getData || [])}</ul>
    </div>
  );
}
