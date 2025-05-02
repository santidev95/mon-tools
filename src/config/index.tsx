
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { monadTestnet } from '@reown/appkit/networks'

export const projectId = '854d07d1f47b43a5aa7a7d35e9a4d29f'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [monadTestnet]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig