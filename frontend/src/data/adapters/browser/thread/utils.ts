import { ApiPromise } from '@polkadot/api'
import { ContractPromise } from '@polkadot/api-contract'
import THREAD_ABI from '@threadhub/contracts/deployments/thread/thread.json'

export const getThreadContractPromise = (api: ApiPromise, contractAddress: string) => {
  return new ContractPromise(api, THREAD_ABI, contractAddress)
}
