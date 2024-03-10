import THREAD_ABI from '@inkathon/contracts/deployments/thread/thread.json'
import { ApiPromise } from '@polkadot/api'
import { ContractPromise } from '@polkadot/api-contract'

export const getThreadContractPromise = (api: ApiPromise, contractAddress: string) => {
  return new ContractPromise(api, THREAD_ABI, contractAddress)
}
