import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Guam AutoWeb — Admin',
  description: 'Lead generation and website automation dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
