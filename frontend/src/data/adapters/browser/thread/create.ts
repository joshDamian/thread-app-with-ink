import type { ApiPromise } from '@polkadot/api'
import type { ContractPromise } from '@polkadot/api-contract'
import { IKeyringPair } from '@polkadot/types/types'

import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

interface CreateNewThreadParams {
  api: ApiPromise
  userAccount: string | IKeyringPair
  threadManagerContract: ContractPromise
  message: string
}

const createNewThread = async (params: CreateNewThreadParams) => {
  const { userAccount, api, threadManagerContract, message } = params

  const result = await contractTxWithToast(
    api,
    userAccount,
    threadManagerContract,
    'createThread',
    {},
    [message],
  )
}

export { createNewThread }
