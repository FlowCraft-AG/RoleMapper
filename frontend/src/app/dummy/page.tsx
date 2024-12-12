import DetailsPanel from "./DetailsPanel";
import Sidebar from "./Sidebar";
import TreeView from "./TreeView";


export default function ActiveDirectoryPage() {
  const data = [
  {
    id: "1",
    name: "Hochschule Karlsruhe (HKA)",
    children: [
      {
        id: "2",
        name: "Rektorat",
        children: [
          {
            id: "3",
            name: "Rektorin",
            children: [{
              id: "1", name: "bero0002",
            }
            ]
          },
          {
            id: "4",
            name: "Prorektor",
            children: [
              { id: "1", name: "nera0001" },
              { id: "2", name: "bujs0001" },
            ]
          },
          {
        id: "6",
        name: "Fakultäten",
        children: [
          { id: "7", name: "Architektur und Bauwesen" },
          { id: "8", name: "Elektrotechnik und Informationstechnik" },
          {
            id: "9",
            name: "Informatik und Wirtschaftsinformatik",
            children: [
              {
                id: "19",
                name: "Dekanat",
                children: [
                  {
                    id: "21",
                    name: "Dekan",
                  },
                  { id: "22", name: "VizeDekan" },
                  { id: "23", name: "Prodekan" },
                ]
              },
              { id: "20", name: "Sekretariat"}
            ]
          },
          { id: "10", name: "Informationsmanagement und Medien" },
          { id: "11", name: "Maschinenbau und Mechatronik" },
          { id: "12", name: "Wirtschaftswissenschaften" },
        ],
          },
          {
        id: "13",
        name: "Zentrale Einrichtungen",
        children: [
          { id: "14", name: "Rechenzentrum" },
          { id: "15", name: "Bibliothek" },
          { id: "16", name: "International Office" },
        ],
          },
          {
        id: "17",
        name: "Verwaltung",
        children: [
          { id: "18", name: "Finanzen" },
        ],
      },
        ],
      },
    ],
  },
];


  const details = {
  _id: "673ed989e1746bf8e6aa19e4",
  userId: "gyca1011",
  userType: "student",
  userRole: "-",
  orgUnit: "IWI",
  active: true,
  validFrom: "2024-01-04T00:21:03.176+00:00",
  validUntil: "2100-12-31T00:00:00.000+00:00",
  student: {
    _id: "65c501afa3cc6ccbde337542",
    courseOfStudy: "WIB",
    courseOfStudyUnique: "58|WIB|-|-|H|6|-|S|V|1|",
    courseOfStudyName: "Wirtschaftsinformatik",
    level: "Bachelor",
    examRegulation: "6",
    courseOfStudyShort: "WIIB",
  },
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
