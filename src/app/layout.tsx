/**
 * Root Next.js layout that applies global styles, shared metadata, and the Redux provider to every page.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/app/StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Creative Automation Pipeline',
  description: 'AI-powered ad campaign creative generation',
};

/**
 * The root layout component for the application.
 * It provides the base HTML structure, global font (Inter), and integrates the StoreProvider.
 * 
 * **User Story:**
 * - As a developer, I want a consistent root layout that handles global styling 
 *   and state provision so I can focus on building feature-specific screens.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
