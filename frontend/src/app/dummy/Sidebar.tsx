// components/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '1rem' }}>
      <ul>
        <li><Link href="/users">Benutzer</Link></li>
        <li><Link href="/groups">Gruppen</Link></li>
        <li><Link href="/roles">Rollen</Link></li>
        <li><Link href="/permissions">Berechtigungen</Link></li>
      </ul>
    </aside>
  );
}
