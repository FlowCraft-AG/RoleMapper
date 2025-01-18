import { Metadata } from 'next';
import ProcessInstancesPage from './ProcessInstances';

export const metadata: Metadata = {
  title: 'Aktiven Prozessinstanzen',
};

export default function Page() {
  return <ProcessInstancesPage />;
}
