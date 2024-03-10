import { getDeploymentData } from '@/utils/getDeploymentData'
import { initPolkadotJs } from '@/utils/initPolkadotJs'
import { writeContractAddresses } from '@/utils/writeContractAddresses'
import { deployContract } from '@scio-labs/use-inkathon/helpers'

/**
 * Script that deploys the thread_manager contract and writes its address to a file.
 *
 * Parameters:
 *  - `DIR`: Directory to read contract build artifacts & write addresses to (optional, defaults to `./deployments`)
 *  - `CHAIN`: Chain ID (optional, defaults to `development`)
 *
 * Example usage:
 *  - `pnpm run deploy`
 *  - `CHAIN=alephzero-testnet pnpm run deploy`
 */
const main = async () => {
  const initParams = await initPolkadotJs()
  const { api, chain, account } = initParams

  // Deploy thread manager contract
  const { abi, wasm } = await getDeploymentData('thread_manager')
  const { abi: thread_abi } = await getDeploymentData('thread')

  const threadManager = await deployContract(api, account, abi, wasm, 'new', [
    thread_abi.source.hash,
  ])

  // Write contract addresses to `{contract}/{network}.ts` file(s)
  await writeContractAddresses(chain.network, {
    thread_manager: threadManager,
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => process.exit(0))
