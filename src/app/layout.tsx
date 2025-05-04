import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { getServerSession } from 'next-auth';
import AuthNavbar from '@/components/AuthNavbar';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Ordens de Serviço',
  description: 'Sistema para gerenciamento de ordens de serviço',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {session && <AuthNavbar />}
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
