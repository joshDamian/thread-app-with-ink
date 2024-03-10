import Link from 'next/link'
import { FC, useState } from 'react'

import type { ThreadPreview } from '@/data/schemas/thread'
import { formatDistanceToNow } from 'date-fns'
import { ExpandIcon, MessageSquareIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'
import Skeleton from 'react-loading-skeleton'
import useSWR from 'swr'

import { Spinner } from '@/components/ui/spinner'
import { truncateHash } from '@/utils/truncate-hash'

interface ThreadPreviewLoaderProps {
  getPreviewInfo: (id: string) => Promise<ThreadPreview>
  threadId: string
  likeThread: (id: string, userAccount: string) => Promise<void>
  userAccount?: string
}

const ThreadPreviewLoader: FC<ThreadPreviewLoaderProps> = ({
  threadId,
  getPreviewInfo,
  userAccount,
  likeThread,
}) => {
  const key = `/threads/${threadId}/preview`
  const { data: thread, error, mutate } = useSWR<ThreadPreview>(key, () => getPreviewInfo(threadId))

  const [likingThread, setLikingThread] = useState(false)

  if (error) return <div>Error loading thread preview</div>

  const handleLike = async () => {
    if (!userAccount) {
      toast.error('Connect an account to like')
      return
    }

    if (!thread || likingThread) return

    try {
      setLikingThread(true)
      await likeThread(threadId, userAccount)

      mutate({
        ...thread,
        likes: [...thread.likes, userAccount],
      })
    } catch (error) {
      toast.error('Failed to like thread')
    } finally {
      setLikingThread(false)
    }
  }

  if (!thread)
    return (
      <div className="w-full rounded-md border border-gray-400">
        <div className="rounded-t-md border-b p-3">
          <Skeleton count={2} width={'100%'} />
        </div>
        <div className="p-3">
          <Skeleton count={3} width="100%" />
        </div>
        <div className="grid grid-cols-3 gap-4 rounded-b-md border-t p-3 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={28} width="100%" />
          ))}
        </div>
      </div>
    )

  const hasLiked = userAccount ? thread.likes.includes(userAccount) : false
  const humanReadableCreatedAt = formatDistanceToNow(thread.createdAt, {
    addSuffix: true,
  })

  return (
    <section className="flex flex-col divide-y divide-gray-400 rounded-md border border-gray-400">
      <div className="flex flex-wrap justify-between gap-4 rounded-t-md p-3">
        <span>Author: {truncateHash(thread.creator)}</span>
        <span className="text-gray-400">{humanReadableCreatedAt}</span>
      </div>
      <div className="whitespace-pre-wrap p-3">{thread.message}</div>
      <div className="grid grid-cols-3 gap-4 rounded-b-md p-3 sm:gap-6">
        <div className="flex items-center justify-center">
          {hasLiked ? (
            <RiHeartFill className="text-red-500" />
          ) : (
            <button onClick={handleLike}>{likingThread ? <Spinner /> : <RiHeartLine />}</button>
          )}
          <span className="ml-2">{thread.likes.length}</span>
        </div>

        <div className="flex items-center justify-center">
          <Link
            className="flex items-center justify-center"
            href={`/view-thread?thread=${threadId}`}
          >
            <MessageSquareIcon />
            <span className="ml-2">{thread.childrenIds.length}</span>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <Link href={`/view-thread?thread=${threadId}`}>
            <ExpandIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ThreadPreviewLoader
