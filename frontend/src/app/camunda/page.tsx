import { Metadata } from 'next';
import ProcessInstancesPage from '../../components/camunda/ProcessInstances';

export const metadata: Metadata = {
  title: 'Aktiven Prozessinstanzen',
};

export default function Page() {
  return <ProcessInstancesPage />;
}
