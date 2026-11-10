import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StackLens — Website Tech Stack & Architecture Inspector',
  description: 'Analyze any website link to detect its frontend, backend languages, CMS, hosting, and AI-powered architecture breakdown.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
