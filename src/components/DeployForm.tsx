'use client';

import { useState } from 'react';
import { useDeployToken } from '@/hooks/useDeployToken';
import { TOKEN_PROFILES, TokenProfile } from '@/constants/presets';
import { useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';

export default function DeployForm() {
  const { deployToken, isPending } = useDeployToken();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [form, setForm] = useState({
    profile: 'basic' as TokenProfile,
    name: '',
    symbol: '',
    supply: '',
    cap: '',
  });

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();
    const loadingToast = toast.loading('Creating token...');
    try {
      const hash = await deployToken(form);
      setTxHash(hash);
      toast.dismiss(loadingToast);
      toast.success('Token created successfully!', {
        duration: 4000,
        icon: '✅',
      });
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to create token.');
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl bg-[#1a1a1a] rounded-xl p-8 space-y-6 mx-auto border border-[#2a2a2a]"
    >
    <h2 className="text-2xl font-bold text-white mb-2">Deploy new Token</h2>
  
    {/* Token Type (Checkbox visual) */}
    <div>
      <label className="block text-sm font-semibold text-purple-400 mb-3">Token Type</label>
      <div className="flex gap-3 justify-between">
        {TOKEN_PROFILES.map((p) => (
          <label
            key={p}
            className={`flex items-center text-sm font-medium px-5 py-2 rounded-full cursor-pointer transition
              ${form.profile === p ? 'bg-purple-600 text-white' : 'bg-[#101010] text-purple-300 hover:bg-purple-700'}
            `}
          >
            <input
              type="checkbox"
              checked={form.profile === p}
              onChange={() => setForm({ ...form, profile: p })}
              className="hidden"
            />
            <span className="capitalize">{p}</span>
          </label>
        ))}
      </div>
    </div>
      
    {/* Token Name */}
    <div>
      <label className="block text-sm text-purple-200 mb-1">Token Name</label>
      <input
        type="text"
        required
        value={form.name}
        onChange={handleChange('name')}
        className="w-full bg-[#0f0f0f] text-white border border-purple-600 rounded px-3 py-2"
        placeholder="e.g. MonToken"
      />
    </div>
  
    {/* Symbol */}
    <div>
      <label className="block text-sm text-purple-200 mb-1">Symbol</label>
      <input
        type="text"
        required
        value={form.symbol}
        onChange={handleChange('symbol')}
        className="w-full bg-[#0f0f0f] text-white border border-purple-600 rounded px-3 py-2"
        placeholder="e.g. MNT"
      />
    </div>
  
    {/* Initial Supply */}
    <div>
      <label className="block text-sm text-purple-200 mb-1">Initial Supply</label>
      <input
        type="number"
        required
        value={form.supply}
        onChange={handleChange('supply')}
        className="w-full bg-[#0f0f0f] text-white border border-purple-600 rounded px-3 py-2"
        placeholder="e.g. 1000"
      />
    </div>
  
    {/* Cap (if needed) */}
    {form.profile === 'capped' && (
      <div>
        <label className="block text-sm text-purple-200 mb-1">Cap (Max Supply)</label>
        <input
          type="number"
          required
          value={form.cap}
          onChange={handleChange('cap')}
          className="w-full bg-[#0f0f0f] text-white border border-purple-600 rounded px-3 py-2"
          placeholder="e.g. 100000"
        />
      </div>
    )}
  
    {/* Submit button */}
    <button
      type="submit"
      disabled={isPending || isLoading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md transition disabled:opacity-50"
    >
      {isPending || isLoading ? 'Creating...' : 'Create Token'}
    </button>
  
    {/* Optional link to explorer */}
    {isSuccess && txHash && (
      <p className="text-sm text-green-400 text-center">
        <a
          href={`https://testnet.monadexplorer.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-green-300"
        >
          View transaction on Explorer
        </a>
      </p>
    )}
  </form>
  
  );
}