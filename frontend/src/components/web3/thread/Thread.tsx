import Link from 'next/link'
import { ComponentProps, FC, useState } from 'react'

import { ThreadPreview } from '@/data/schemas/thread'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeftIcon, MessageSquareIcon, ShareIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'

import { Spinner } from '@/components/ui/spinner'
import { truncateHash } from '@/utils/truncate-hash'

import ThreadCommentForm from './ThreadMessageForm'
import ThreadPreviewLoader from './ThreadPreviewLoader'

type ThreadPreviewLoaderProps = ComponentProps<typeof ThreadPreviewLoader>

interface ThreadProps {
  thread: ThreadPreview
  likeThread: (threadId: string, userAccount: string) => Promise<void>
  getThreadPreview: ThreadPreviewLoaderProps['getPreviewInfo']
  commentOnThread: (params: { threadId: string; message: string; author: string }) => Promise<void>
  userAccount?: string
}

const Thread: FC<ThreadProps> = ({
  thread,
  likeThread,
  commentOnThread,
  userAccount,
  getThreadPreview,
}) => {
  const [likingThread, setLikingThread] = useState(false)

  const hasLiked = userAccount ? thread.likes.includes(userAccount) : false
  const humanReadableCreatedAt = formatDistanceToNow(thread.createdAt, {
    addSuffix: true,
  })

  const handleLike = async () => {
    if (!userAccount) {
      toast.error('Connect an account to like')
      return
    }

    if (likingThread) return

    try {
      setLikingThread(true)

      await likeThread(thread.id, userAccount)
    } catch (error) {
      toast.error('Failed to like thread')
    } finally {
      setLikingThread(false)
    }
  }

  const handleComment = async (message: string) => {
    if (!userAccount) {
      toast.error('Connect an account to comment')
      return
    }

    await commentOnThread({ message, threadId: thread.id, author: userAccount })
  }

  const copyThreadUrl = async () => {
    if (!navigator.clipboard) {
      toast.error('Clipboard not supported')
      return
    }

    await navigator.clipboard.writeText(window.location.href)
    toast.success('Thread url copied')
  }

  return (
    <section className="flex max-w-[620px] flex-col gap-10">
      <Link href={'/'} className="flex items-center gap-1.5">
        <ArrowLeftIcon /> Back to Feed
      </Link>
      <section className="flex flex-col divide-y divide-gray-400 rounded-md border border-gray-400">
        <div className="flex flex-wrap justify-between gap-4 rounded-t-md p-3">
          <span>Author: {truncateHash(thread.creator)}</span>
          <span>{humanReadableCreatedAt}</span>
        </div>
        <div className="p-3">{thread.message}</div>
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
            <MessageSquareIcon />
            <span className="ml-2">{thread.childrenIds.length}</span>
          </div>

          <div className="flex items-center justify-center">
            <button type="button" className="flex items-center gap-2" onClick={copyThreadUrl}>
              <ShareIcon />
              <span>Share url</span>
            </button>
          </div>
        </div>
      </section>

      <section>
        <ThreadCommentForm
          ctaText="Post Comment"
          formTitle="Add Comment"
          postThreadMessage={handleComment}
        />
      </section>
      <section>
        <h3 className="mb-4 text-2xl">Comments</h3>
        <section className="flex flex-col gap-6">
          {thread.childrenIds.map((childId) => (
            <ThreadPreviewLoader
              likeThread={likeThread}
              key={childId}
              getPreviewInfo={getThreadPreview}
              threadId={childId}
            />
          ))}
          {thread.childrenIds.length === 0 && (
            <div className="text-center text-gray-400">No comments</div>
          )}
        </section>
      </section>
    </section>
  )
}

export default Thread
