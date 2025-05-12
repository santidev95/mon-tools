'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { monadTestnet } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

const metadata = {
  name: 'monadic-tools',
  description: 'Monadic Tools',
  url: 'http://localhost:3000', 
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [monadTestnet],
  defaultNetwork: monadTestnet,
  metadata: metadata,
  features: {
    analytics: true
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#c084fc",              
    "--w3m-color-mix": "#000000",           
    "--w3m-color-mix-strength": 0,          
    "--w3m-font-family": "monospace",       
    "--w3m-font-size-master": "9px",
    "--w3m-border-radius-master": "5px",
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider