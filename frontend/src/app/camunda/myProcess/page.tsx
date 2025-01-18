import { Metadata } from 'next';
import UserProcessInstancesPage from '../../../components/camunda/UserProcessInstancePage';

export const metadata: Metadata = {
  title: 'Meine Aktiven Prozessinstanzen',
};

export default function Page() {
  return <UserProcessInstancesPage />;
}
