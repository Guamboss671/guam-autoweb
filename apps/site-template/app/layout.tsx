import './globals.css';

export const metadata = {
  title: 'Local Business — Guam',
  description: 'Professional website for a Guam local business',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
