import { AuthProvider } from '@/lib/contexts/AuthContext';
import '../src/app.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZTLog Admin',
  description: 'Blog admin dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
