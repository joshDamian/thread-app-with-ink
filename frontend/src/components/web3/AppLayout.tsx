'use client'

import { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { useInkathon } from '@scio-labs/use-inkathon'
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
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[445px] flex-col items-center gap-12 border-r px-12 pt-12">
        <ConnectButton />
        <ChainInfo />
      </aside>
      <main className="ml-[445px] flex-1 grow px-12 py-12">{children}</main>
    </div>
  )
}

export default AppLayout
