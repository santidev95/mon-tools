"use client";

import { useState } from 'react';
import { useDeployToken } from '@/hooks/useDeployToken';
import { TOKEN_PROFILES, TokenProfile } from '@/constants/presets';
import { useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';

export default function TokenDeployerApp() {
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
      className="text-sm font-mono text-white p-3 space-y-4 w-[340px] overflow-y-auto max-h-[70vh]"
    >
      <h2 className="text-base font-bold text-purple-300">Deploy new Token</h2>

      <div>
        <label className="block text-xs text-purple-200 mb-1">Token Type</label>
        <div className="flex gap-2 flex-wrap">
          {TOKEN_PROFILES.map((p) => (
            <label
              key={p}
              className={`px-3 py-1 rounded-full text-xs cursor-pointer transition ${
                form.profile === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-purple-300 hover:bg-purple-700'
              }`}
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

      <div>
        <label className="block text-xs text-purple-200 mb-1">Token Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={handleChange('name')}
          className="w-full bg-zinc-900 border border-purple-600 rounded px-2 py-1 text-xs"
          placeholder="e.g. MonToken"
        />
      </div>

      <div>
        <label className="block text-xs text-purple-200 mb-1">Symbol</label>
        <input
          type="text"
          required
          value={form.symbol}
          onChange={handleChange('symbol')}
          className="w-full bg-zinc-900 border border-purple-600 rounded px-2 py-1 text-xs"
          placeholder="e.g. MNT"
        />
      </div>

      <div>
        <label className="block text-xs text-purple-200 mb-1">Initial Supply</label>
        <input
          type="number"
          required
          value={form.supply}
          onChange={handleChange('supply')}
          className="w-full bg-zinc-900 border border-purple-600 rounded px-2 py-1 text-xs"
          placeholder="e.g. 1000"
        />
      </div>

      {form.profile === 'capped' && (
        <div>
          <label className="block text-xs text-purple-200 mb-1">Cap</label>
          <input
            type="number"
            required
            value={form.cap}
            onChange={handleChange('cap')}
            className="w-full bg-zinc-900 border border-purple-600 rounded px-2 py-1 text-xs"
            placeholder="e.g. 100000"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md text-xs disabled:opacity-50"
      >
        {isPending || isLoading ? 'Creating...' : 'Create Token'}
      </button>

      {isSuccess && txHash && (
        <p className="text-xs text-green-400 text-center">
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
