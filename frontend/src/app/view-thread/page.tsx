'use client'

import { redirect } from 'next/navigation'

import { getThreadInfo } from '@/data/adapters/browser/thread/get'
import { useInkathon } from '@scio-labs/use-inkathon'

import ThreadFullLoader from '@/components/web3/thread/ThreadFullLoader'

interface ViewThreadPageProps {
  searchParams: { thread: string }
}

export default function ViewThreadPage({ searchParams: { thread } }: ViewThreadPageProps) {
  const { api } = useInkathon()

  const threadId = thread

  if (!threadId) {
    redirect('/')
  }

  const handleGetThreadInfo = async (threadId: string) => {
    if (!api) throw new Error('Api not loaded')

    return await getThreadInfo(threadId, api)
  }

  return <ThreadFullLoader threadId={threadId} getThreadInfo={handleGetThreadInfo} />
}
