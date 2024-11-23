import DetailsPanel from '../../components/DetailsPanel';
import Sidebar from '../../components/Sidebar';
import TreeView from '../../components/TreeView';

export default function ActiveDirectoryPage() {
  const data = [
    {
      id: '1',
      name: 'Organisation',
      children: [
        {
          id: '2',
          name: 'Abteilung IT',
          children: [
            { id: '3', name: 'Benutzer: Max Mustermann' },
            { id: '4', name: 'Benutzer: Maria Müller' },
          ],
        },
        {
          id: '5',
          name: 'Abteilung HR',
          children: [{ id: '6', name: 'Benutzer: Hans Schneider' }],
        },
      ],
    },
  ];

  const details = {
    Name: 'Max Mustermann',
    Rolle: 'Administrator',
    Gruppe: 'IT',
    Email: 'max.mustermann@example.com',
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          <TreeView data={data} />
        </div>
        <DetailsPanel title="Benutzerinformationen" details={details} />
      </div>
    </div>
  );
}
