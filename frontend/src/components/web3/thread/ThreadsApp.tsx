'use client'

import { FC } from 'react'

import { createNewThread } from '@/data/adapters/browser/thread/create'
import { getAllThreads, getThreadInfo } from '@/data/adapters/browser/thread/get'
import { likeThread } from '@/data/adapters/browser/thread/update'
import { ContractIds } from '@/deployments/deployments'
import ThreadManagerContract from '@inkathon/contracts/typed-contracts/contracts/thread_manager'
import {
  useInkathon,
  useRegisteredContract,
  useRegisteredTypedContract,
} from '@scio-labs/use-inkathon'
import { toast } from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import useSWR from 'swr'

import ListThreads from '@/components/web3/thread/ListThreads'
import ThreadMessageForm from '@/components/web3/thread/ThreadMessageForm'

interface ThreadsAppProps {}

const ThreadsApp: FC<ThreadsAppProps> = () => {
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.ThreadManager)

  const { typedContract } = useRegisteredTypedContract(
    ContractIds.ThreadManager,
    ThreadManagerContract,
  )

  const { data: threadIds, error: threadsFetchError } = useSWR('threads', () =>
    typedContract
      ? getAllThreads({
          typedContract: typedContract,
        })
      : undefined,
  )

  if (threadsFetchError) return <div>Error Loading Threads</div>

  if (!typedContract)
    return (
      <div className="flex h-[250px] w-full max-w-[620px] items-center justify-center rounded-md border border-dashed text-lg">
        Connect your wallet to use Threads!
      </div>
    )

  if (!threadIds)
    return (
      <section className="flex w-full max-w-[620px] flex-col gap-8">
        <Skeleton height={45} />
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={160} />
          ))}
        </div>
      </section>
    )

  const handleGetThreadInfo = async (threadId: string) => {
    if (!api) throw new Error('Api not loaded')

    return await getThreadInfo(threadId, api)
  }

  const handleLikeThread = async (threadId: string, userAccount: string) => {
    if (!contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    return await likeThread({
      userAccount,
      api,
      threadContractAddress: threadId,
    })
  }

  const handlePostThreadMessage = async (message: string) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    return await createNewThread({
      threadManagerContract: contract,
      api,
      userAccount: activeAccount.address,
      message,
    })
  }

  return (
    <section className="flex w-full max-w-[620px] flex-col gap-8">
      <ThreadMessageForm
        ctaText="Post Message"
        formTitle="Create New Thread"
        postThreadMessage={handlePostThreadMessage}
      />

      <ListThreads
        userAccount={activeAccount?.address}
        likeThread={handleLikeThread}
        getPreviewInfo={handleGetThreadInfo}
        threadIds={threadIds}
      />

      {/* Contract Address */}
      <p className="text-center font-mono text-xs text-gray-600">
        {contract ? contractAddress : 'Loading…'}
      </p>
    </section>
  )
}

export default ThreadsApp
