'use client'

import { redirect, useSearchParams } from 'next/navigation'

import { getThreadInfo } from '@/data/adapters/browser/thread/get'
import { useInkathon } from '@scio-labs/use-inkathon'

import ThreadFullLoader from '@/components/web3/thread/ThreadFullLoader'

export default function ViewThreadPage() {
  const { api } = useInkathon()

  const searchParams = useSearchParams()
  const threadId = searchParams.get('thread')

  if (!threadId) {
    redirect('/')
  }

  const handleGetThreadInfo = async (threadId: string) => {
    if (!api) throw new Error('Api not loaded')

    return await getThreadInfo(threadId, api)
  }

  return <ThreadFullLoader threadId={threadId} getThreadInfo={handleGetThreadInfo} />
}
