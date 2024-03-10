import { getDeploymentData } from '@/utils/getDeploymentData'
import { initPolkadotJs } from '@/utils/initPolkadotJs'
import { ContractPromise } from '@polkadot/api-contract'
import {
  contractQuery,
  contractTx,
  decodeOutput,
  deployContract,
} from '@scio-labs/use-inkathon/helpers'

/**
 * Example script that updates & reads a message from a greeter contract.
 * Can be used as a template for other scripts.
 *
 * Parameters:
 *  - `DIR`: Directory to read contract build artifacts (optional, defaults to `./deployments`)
 *  - `CHAIN`: Chain ID (optional, defaults to `development`)
 *
 * Example usage:
 *  - `pnpm run script <script-name>`
 *  - `CHAIN=alephzero-testnet pnpm run script <script-name>`
 */
const main = async () => {
  const { api, account } = await initPolkadotJs()

  // Deploy thread_manager contract
  const { abi, wasm } = await getDeploymentData('thread_manager')
  const { abi: thread_abi } = await getDeploymentData('thread')
  const { address } = await deployContract(api, account, abi, wasm, 'new', [thread_abi.source.hash])
  const contract = new ContractPromise(api, abi, address)

  // Update message
  try {
    await contractTx(api, account, contract, 'create_thread', {}, ['Hello, script!'])
    console.log('\nSuccessfully created a new thread')
  } catch (error) {
    console.error('Error while creating thread', error)
  }

  // Read message
  const result = await contractQuery(api, '', contract, 'getThreads')
  const { decodedOutput } = decodeOutput(result, contract, 'getThreads')
  console.log('\nQueried threads:', decodedOutput)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => process.exit(0))
