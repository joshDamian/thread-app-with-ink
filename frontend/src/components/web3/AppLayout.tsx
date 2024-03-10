'use client'

import Image from 'next/image'
import { FC, PropsWithChildren, useEffect } from 'react'

import { useInkathon } from '@scio-labs/use-inkathon'
import threadHubLogo from 'public/images/thread-hub-logo.svg'
import { toast } from 'react-hot-toast'

import { ChainInfo } from '@/components/web3/chain-info'
import { ConnectButton } from '@/components/web3/connect-button'

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  // Display `useInkathon` error messages
  const { error } = useInkathon()

  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  return (
    <div className="relative flex">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[445px] flex-col items-center gap-12 border-r px-12 pt-12 sm:flex">
        <ChainInfo />
      </aside>
      <main className="flex-1 grow sm:ml-[445px]">
        <header className="sticky top-0 z-50 flex justify-between border-b bg-background px-12 py-8">
          <Image src={threadHubLogo} alt="ThreadHub Logo" width={45} height={45} />
          <ConnectButton />
        </header>
        <div className="px-12 py-12">{children}</div>
      </main>
    </div>
  )
}

export default AppLayout
