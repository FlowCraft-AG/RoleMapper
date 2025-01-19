import { Metadata } from 'next';
import SignInPage from './LoginPage';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Page() {
  return <SignInPage />;
}
