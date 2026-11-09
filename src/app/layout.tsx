import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import {
  BASE_URL,
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from '@/shared/config/constants';
import { KakaoProvider } from '@/shared/providers/KakaoProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#f5f5f5] antialiased`}
      >
        <KakaoProvider>
          <div className='mx-auto w-full max-w-screen-sm bg-white'>
            {children}
          </div>
        </KakaoProvider>
      </body>
    </html>
  );
}
