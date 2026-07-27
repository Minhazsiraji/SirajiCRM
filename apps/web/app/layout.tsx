import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'OrderPilot',
  description: 'Cost per delivered order, by ad creative.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
