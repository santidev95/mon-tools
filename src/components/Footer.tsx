import { Github, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-violet-900/40 bg-gradient-to-b from-black/50 via-purple-950/50 to-slate-900/50 backdrop-blur-md py-8 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-violet-300 text-transparent bg-clip-text">MonTools</h3>
            <p className="text-sm text-violet-200">A comprehensive suite of blockchain tools for developers and users.</p>
            <div className="flex space-x-4">
              <Link href="https://github.com/SantiSjp/mon-tools" target="_blank" className="text-violet-400 hover:text-purple-300 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://x.com/montools_xyz" target="_blank" className="text-violet-400 hover:text-purple-300 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-purple-200 mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  Token Tools
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  NFT Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-purple-200 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://montools.xyz/docs" target="_blank" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://github.com/SantiSjp/mon-tools" target="_blank" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  Repository
                </Link>
              </li>         
              <li>
                <Link href="https://status.montools.xyz" target="_blank" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  System Status
                </Link>
              </li>     
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-purple-200 mb-4">Monad Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://testnet.monad.xyz" target="_blank" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  Testnet
                </Link>
              </li>
              <li>
                <Link href="https://testnet.monadexplorer.com" target="_blank" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="https://docs.monad.xyz" target="_blank" className="text-sm text-violet-300 hover:text-purple-200 transition-colors">
                  Docs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-violet-900/30 flex flex-col md:flex-row justify-between items-center">        
          <p className="text-xs text-violet-400">
            {new Date().getFullYear()} MonTools v2.0.0  |  Built by&nbsp;
            <a href="https://x.com/gabriell_santi" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-violet-200 font-semibold">
               Santi
              </a>  
          </p>
          
          
        </div>
      </div>
    </footer>
  )
}
