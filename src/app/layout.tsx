import type { Metadata } from 'next';
import './font.css';
import './globals.css';
import Gnb from '@/components/gnb/Gnb';
import { cookies } from 'next/headers';
import { COOKIE_KEY } from '@/constant/common';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Tving workshop',
  description: 'Tving workshop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const nextCookies = cookies();
  const employeeNumber = nextCookies.get(COOKIE_KEY.WORKSHOP_TOKEN)?.value || '';

  return (
    <html lang="ko">
      <head>
        <title>나는 대놓고 보물찾기를 꿈꾼다.</title>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>
        <Gnb employeeNumber={employeeNumber} />
        {children}
      </body>
    </html>
  );
}
