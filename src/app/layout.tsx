import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Astronixa CRM • Ohana Ecosystem',
  description: 'Autonomous Subagent CRM powered by Astronixa Universe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className="h-full overflow-hidden">
      <body className="flex h-screen h-[100dvh] w-screen overflow-hidden antialiased font-sans transition-colors duration-300 m-0 p-0">
        <ThemeProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
