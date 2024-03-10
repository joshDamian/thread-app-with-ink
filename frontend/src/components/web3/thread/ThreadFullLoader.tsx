import { ComponentProps, FC } from 'react'

import { commentOnThread, likeThread } from '@/data/adapters/browser/thread/update'
import { ThreadPreview } from '@/data/schemas/thread'
import { useInkathon } from '@scio-labs/use-inkathon'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import useSWR from 'swr'

import Thread from './Thread'

type ThreadProps = ComponentProps<typeof Thread>

interface ThreadFullLoaderProps {
  threadId: string
  getThreadInfo: (threadId: string) => Promise<ThreadPreview>
}

const ThreadFullLoader: FC<ThreadFullLoaderProps> = ({ threadId, getThreadInfo }) => {
  const { api, activeAccount, activeSigner } = useInkathon()

  const key = `/threads/${threadId}/preview`
  const { data: thread, error } = useSWR<ThreadPreview>(key, () => getThreadInfo(threadId))

  if (error) return <div>Error loading thread</div>

  if (!thread)
    return (
      <div className="flex max-w-[620px] flex-col gap-8">
        <div className="w-full rounded-md border border-gray-400">
          <div className="rounded-t-md border-b p-3">
            <Skeleton count={2} width={'100%'} />
          </div>
          <div className="p-3">
            <Skeleton count={3} width="100%" />
          </div>
          <div className="grid grid-cols-3 gap-4 rounded-b-md border-t p-3 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={45} width="100%" />
            ))}
          </div>
        </div>
        <Skeleton height={65} width={'100%'} />
      </div>
    )

  const handleLikeThread = async (threadId: string, userAccount: string) => {
    if (!api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    return await likeThread({
      threadContractAddress: threadId,
      userAccount,
      api,
    })
  }

  const handleCommentOnThread: ThreadProps['commentOnThread'] = async (params) => {
    const { author, message, threadId } = params
    if (!activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    return await commentOnThread({
      api,
      userAccount: author,
      comment: message,
      threadContractAddress: threadId,
    })
  }

  return (
    <Thread
      userAccount={activeAccount?.address}
      likeThread={handleLikeThread}
      thread={thread}
      getThreadPreview={getThreadInfo}
      commentOnThread={handleCommentOnThread}
    />
  )
}

export default ThreadFullLoader
