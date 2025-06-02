import { useEffect, useState } from "react";
import { allDomainsClient } from "@/lib/clients/allDomains";
import { Loader2 } from "lucide-react";
import { useAccount } from 'wagmi';

interface DomainRecord {
  domain_name: string;
  tld: string;
  expires_at: string;
  created_at: string;
  main_domain_address: string;
  transferrable: boolean;
}

export function DomainsCard() {
  const { address } = useAccount();
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      if (!address) return;
      
      try {
        const userDomains = await allDomainsClient.getAllUserDomains(address);
        console.log(userDomains);
        // Transform the domain records to match our interface
        const formattedDomains = userDomains.map(domain => ({
          domain_name: domain.domain_name,
          tld: domain.tld,
          expires_at: domain.expires_at,
          created_at: domain.created_at,
          main_domain_address: domain.main_domain_address,
          transferrable: domain.transferrable
        }));
        setDomains(formattedDomains);
      } catch (error) {
        console.error('Error fetching domains:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, [address]);

  if (!address) {
    return (
      <div className="w-full rounded-xl border border-white/10 bg-gradient-to-b from-purple-900/40 via-blue-900/30 to-blue-900/20 backdrop-blur-md p-6">
        <p className="text-zinc-400">Connect your wallet to view your domains</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full rounded-xl border border-white/10 bg-gradient-to-b from-purple-900/40 via-blue-900/30 to-blue-900/20 backdrop-blur-md p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-purple-400 w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-white/10 bg-gradient-to-b from-purple-900/40 via-blue-900/30 to-blue-900/20 backdrop-blur-md p-6 mb-10">
      <h2 className="text-xl font-semibold text-purple-300 mb-4">Your Domains</h2>
      {domains.length === 0 ? (
        <p className="text-zinc-400">No domains found</p>
      ) : (
        <><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain) => (
              <div
                key={domain.domain_name + domain.tld}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
              >
                <h3 className="text-lg font-medium text-purple-300">{domain.domain_name}{domain.tld}</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Expires: {new Date(parseInt(domain.expires_at) * 1000).toLocaleDateString()}
                </p>
                {domain.transferrable && (
                  <p className="text-sm text-green-400 mt-1">Transferrable</p>
                )}
              </div>
            ))}
          </div><div className="flex flex-col items-center justify-center">
              <span className="text-sm text-center text-purple-400 mt-4">data by <a href="https://alldomains.id/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">AllDomains</a></span>
            </div>
            </>
      )}
    </div>
  );
} 