'use client'

import { ContractIds } from '@/deployments/deployments'
import { useRegisteredTypedContract } from '@scio-labs/use-inkathon'
import ThreadManagerContract from '@threadhub/contracts/typed-contracts/contracts/thread_manager'

import ThreadsApp from '@/components/web3/thread/ThreadsApp'

export default function HomePage() {
  const { typedContract } = useRegisteredTypedContract(
    ContractIds.ThreadManager,
    ThreadManagerContract,
  )

  if (!typedContract)
    return (
      <div className="flex h-[250px] w-full max-w-[620px] items-center justify-center rounded-md border border-dashed text-lg">
        Connect your wallet to use Threads!
      </div>
    )

  return <ThreadsApp threadManagerContract={typedContract} />
}
