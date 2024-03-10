import { ApiPromise } from '@polkadot/api'

import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

import { getThreadContractPromise } from './utils'

interface CommentOnThreadParams {
  userAccount: string
  threadContractAddress: string
  api: ApiPromise
  comment: string
}

const commentOnThread = async (params: CommentOnThreadParams) => {
  const { userAccount, threadContractAddress, api, comment } = params

  const contractPromise = getThreadContractPromise(api, threadContractAddress)

  await contractTxWithToast(api, userAccount, contractPromise, 'comment', {}, [comment])
}

interface LikeThreadParams {
  userAccount: string
  threadContractAddress: string
  api: ApiPromise
}

const likeThread = async (params: LikeThreadParams) => {
  const { userAccount, threadContractAddress, api } = params

  const contractPromise = getThreadContractPromise(api, threadContractAddress)

  await contractTxWithToast(api, userAccount, contractPromise, 'like', {}, [])
}

export { commentOnThread, likeThread }
