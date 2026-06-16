import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Cairn',
  description: 'Professional development coach',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
