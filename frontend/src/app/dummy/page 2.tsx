import React from 'react';
import TreeView from './TreeView';
/*import DetailsPanel from './DetailsPanel';*/

export default function ActiveDirectoryPage() {
  const data = [
    {
      id: '1',
      name: 'Hochschule Karlsruhe (HKA)',
      children: [
        {
          id: '2',
          name: 'Rektorat',
          children: [
            {
              id: '3',
              name: 'Rektorin',
              children: [{ id: '1', name: 'bero0002' }],
            },
            {
              id: '4',
              name: 'Prorektor',
              children: [
                { id: '1', name: 'nera0001' },
                { id: '2', name: 'bujs0001' },
              ],
            },
            {
              id: '6',
              name: 'Fakultäten',
              children: [
                { id: '7', name: 'Architektur und Bauwesen' },
                { id: '8', name: 'Elektrotechnik und Informationstechnik' },
                {
                  id: '9',
                  name: 'Informatik und Wirtschaftsinformatik',
                  children: [
                    {
                      id: '19',
                      name: 'Dekanat',
                      children: [
                        { id: '21', name: 'Dekan' },
                        { id: '22', name: 'VizeDekan' },
                        { id: '23', name: 'Prodekan' },
                      ],
                    },
                    { id: '20', name: 'Sekretariat' },
                  ],
                },
                { id: '10', name: 'Informationsmanagement und Medien' },
                { id: '11', name: 'Maschinenbau und Mechatronik' },
                { id: '12', name: 'Wirtschaftswissenschaften' },
              ],
            },
            {
              id: '13',
              name: 'Zentrale Einrichtungen',
              children: [
                { id: '14', name: 'Rechenzentrum' },
                { id: '15', name: 'Bibliothek' },
                { id: '16', name: 'International Office' },
              ],
            },
            {
              id: '17',
              name: 'Verwaltung',
              children: [{ id: '18', name: 'Finanzen' }],
            },
          ],
        },
      ],
    },
  ];

  // Data for ID and Name
  const ids = ['nefr0001', 'niol1013', 'nera0001'];
  const name = 'Nees, Franz';

  // Placeholder data for DetailsPanel
  const detailsPlaceholder = {};

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        {/* TreeView Section */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          <TreeView data={data} />
        </div>
        {/* DetailsPanel */}
        <div style={{ flex: 2, padding: '1rem' }}>
          {/*<DetailsPanel title="Benutzerinformationen" details={detailsPlaceholder} />*/}
          {/* IDs and Names Section */}
          <div className="mt-4">
            <div className="row mb-3">
              <div className="col-3 fw-bold">ID</div>
              <div className="col-3 fw-bold">Name</div>
              <div className="col-3 fw-bold">Description</div>
            </div>
            {ids.map((id, index) => (
              <div key={index} className="row mb-2">
                <div className="col-3">{id}</div>
                <div className="col-3">{name}</div>
                <div className="col-3">Description Placeholder</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}