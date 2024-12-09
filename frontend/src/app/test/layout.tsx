import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Active Directory View',
  description: 'Organizational Unit Viewer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
