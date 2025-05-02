import Image from "next/image";
import type { MagicEdenCollection } from "@/lib/clients/magicEdenClient";

interface Props {
  data: MagicEdenCollection;
}

export default function CollectionCard({ data }: Props) {
  const {
    id,
    name,
    description,
    image,
    tokenCount,
    onSaleCount,
    supply,
    remainingSupply,
    externalUrl,
    discordUrl,
    floorAsk,
    volume,
    rank,
    ownerCount,
    createdAt,
  } = data;

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString("en-US") : "N/A";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-gray-100 space-y-4 w-full max-w-2xl mx-auto mt-6">
      <div className="flex gap-4 items-center">
        {image && (
          <Image
            src={image}
            alt={name}
            width={64}
            height={64}
            className="rounded border border-violet-400"
          />
        )}
        <div>
          <h2 className="text-xl font-bold text-violet-400">{name}</h2>
          {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm mt-4">
  <div>
    <p className="text-gray-400">Total Supply</p>
    <p className="font-mono">{supply}</p>
  </div>
  <div>
    <p className="text-gray-400">Remaining</p>
    <p className="font-mono">{remainingSupply}</p>
  </div>
  <div>
    <p className="text-gray-400">On Sale</p>
    <p className="font-mono">{onSaleCount}</p>
  </div>
  <div>
    <p className="text-gray-400">Owner Count</p>
    <p className="font-mono">{ownerCount}</p>
  </div>
  <div>
    <p className="text-gray-400">Created At</p>
    <p className="font-mono">{formatDate(createdAt)}</p>
  </div>
  <div>
    <p className="text-gray-400">Floor Price</p>
    <p className="font-mono">
      {floorAsk?.price.amount.decimal ?? "N/A"} MON
    </p>
  </div>
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm mt-6">
  <div>
    <p className="text-gray-400">1D Volume</p>
    <p className="font-mono">{volume?.["1day"] ?? 0} MON</p>
  </div>
  <div>
    <p className="text-gray-400">7D Volume</p>
    <p className="font-mono">{volume?.["7day"] ?? 0} MON</p>
  </div>
  <div>
    <p className="text-gray-400">30D Volume</p>
    <p className="font-mono">{volume?.["30day"] ?? 0} MON</p>
  </div>
  <div>
    <p className="text-gray-400">All-Time Volume</p>
    <p className="font-mono">{volume?.["allTime"] ?? 0} MON</p>
  </div>
</div>


        <div className="flex gap-4 mt-6">
        {externalUrl && (
            <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 text-sm rounded-md font-mono transition"
            >
            Website
            </a>
        )}
        {discordUrl && (
            <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 text-sm rounded-md font-mono transition"
            >
            Discord
            </a>
        )}
        </div>
    </div>
  );
}
