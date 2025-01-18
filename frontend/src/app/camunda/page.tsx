import { Metadata } from 'next';
import ProcessInstancesPage from './ProcessInstancesPage';

export const metadata: Metadata = {
  title: 'Aktiven Prozessinstanzen',
};

export default function Page() {
  return <ProcessInstancesPage />;
}
