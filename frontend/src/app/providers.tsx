'use client'

import { PropsWithChildren } from 'react'

import { getDeployments } from '@/deployments/deployments'
import { WsProvider } from '@polkadot/api'
import { UseInkathonProvider } from '@scio-labs/use-inkathon'

import { env } from '@/config/environment'

const optionalApiOptions = env.webSocketUrl
  ? { provider: new WsProvider(env.webSocketUrl) }
  : undefined

export default function ClientProviders({ children }: PropsWithChildren) {
  return (
    <UseInkathonProvider
      appName="ink!athon" // TODO
      connectOnInit={true}
      defaultChain={env.defaultChain}
      deployments={getDeployments()}
      apiOptions={optionalApiOptions}
    >
      {children}
    </UseInkathonProvider>
  )
}
