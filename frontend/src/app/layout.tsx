import { Metadata, Viewport } from 'next'
import { PropsWithChildren } from 'react'

import { Analytics } from '@vercel/analytics/react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import 'react-loading-skeleton/dist/skeleton.css'

import { ToastConfig } from '@/app/toast-config'
import { TooltipProvider } from '@/components/ui/tooltip'
import AppLayout from '@/components/web3/AppLayout'
import { env } from '@/config/environment'
import { cn } from '@/utils/cn'

import './globals.css'
import ClientProviders from './providers'

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  title: 'ThreadHub',
  description:
    'A decentralized platform for sharing opinions, where users can express their opinions via threads and receive engagements from other users. Picture Twitter, but on the blockchain.',
  metadataBase: new URL(env.url),
  robots: env.isProduction ? 'all' : 'noindex,nofollow',
  openGraph: {
    type: 'website',
    locale: 'en',
    url: env.url,
    siteName: 'ThreadHub',
    images: [
      {
        url: '/images/thread-hub-og-banner.png',
        width: 657,
        height: 626,
      },
    ],
  },
  twitter: {
    site: '@DevJosh__',
    creator: '@DevJosh__',
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={cn('dark', GeistSans.variable, GeistMono.variable)}>
      <body>
        <ClientProviders>
          <TooltipProvider>
            <AppLayout>{children}</AppLayout>
          </TooltipProvider>
          <ToastConfig />
        </ClientProviders>

        {!!env.isProduction && <Analytics />}
      </body>
    </html>
  )
}
