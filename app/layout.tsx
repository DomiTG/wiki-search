import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WikiRace — Navigate Wikipedia',
  description: 'A competitive game where you navigate Wikipedia using only links.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
