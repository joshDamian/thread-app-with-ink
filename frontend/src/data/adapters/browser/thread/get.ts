import { ThreadPreview } from '@/data/schemas/thread'
import { ApiPromise } from '@polkadot/api'
import { contractQuery, decodeOutput } from '@scio-labs/use-inkathon/helpers'
import type ThreadContract from '@threadhub/contracts/typed-contracts/contracts/thread'
import ThreadManagerContract from '@threadhub/contracts/typed-contracts/contracts/thread_manager'

import { getThreadContractPromise } from './utils'

interface GetAllThreadsParams {
  typedContract: ThreadManagerContract
}

const getAllThreads = async (params: GetAllThreadsParams) => {
  const { typedContract } = params

  // Fetch it with typed contract instance
  const typedResult = await typedContract.query.getThreads()

  if (!typedResult.value.ok) {
    throw new Error('Error fetching threads')
  }

  const unwrappedValues = typedResult.value
    .unwrap()
    .map((value) => value.inner.accountId.toString())

  return unwrappedValues.toReversed()
}

const getThreadInfo = async (contractAddress: string, api: ApiPromise): Promise<ThreadPreview> => {
  const contractPromise = getThreadContractPromise(api, contractAddress)

  const result = await contractQuery(api, contractAddress, contractPromise, 'getInfo')
  const { output, isError, decodedOutput } = decodeOutput(result, contractPromise, 'getInfo')

  if (isError) throw new Error(decodedOutput)

  const typedOutput = output as ReturnType<
    Awaited<ReturnType<ThreadContract['query']['getInfo']>>['value']['unwrap']
  >

  const [creator, message, created_at, likes, children, parent] = typedOutput

  const formatedCreatedAt = Number(created_at.toString().replaceAll(',', ''))

  const threadInfo: ThreadPreview = {
    id: contractAddress,
    message,
    creator: creator.toString(),
    createdAt: new Date(formatedCreatedAt),
    likes: likes.map((like) => like.toString()),
    childrenIds: children.map((child) => child.inner.accountId.toString()).toReversed(),
    parent: parent ? parent.toString() : undefined,
  }

  return threadInfo
}

export { getAllThreads, getThreadInfo }
