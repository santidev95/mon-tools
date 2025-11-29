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
    // Novos campos do formato v4
    media,
    social,
    verification,
    isTradeable,
    royalty,
    collectionType,
    chainData,
  } = data;

  // Usa media.url se image não estiver disponível
  const imageUrl = image || media?.url;
  // Usa social.websiteUrl se externalUrl não estiver disponível
  const websiteUrl = externalUrl || social?.websiteUrl;
  // Usa social.discordUrl se discordUrl não estiver disponível
  const discordLink = discordUrl || social?.discordUrl;

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString("en-US") : "N/A";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-gray-100 space-y-4 w-full max-w-2xl mx-auto mt-6">
      <div className="flex gap-4 items-center">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            width={64}
            height={64}
            className="rounded border border-violet-400"
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-violet-400">{name}</h2>
            {verification === "VERIFIED" && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                ✓ Verified
              </span>
            )}
          </div>
          {description && <p className="text-sm text-gray-400">{description}</p>}
          {chainData && (
            <div className="flex gap-2 mt-2 text-xs">
              {collectionType && (
                <span className="text-gray-500">Type: {collectionType}</span>
              )}
              {chainData.transferability && (
                <span className="text-gray-500">
                  Status: {chainData.transferability.replace(/_/g, " ")}
                </span>
              )}
              {isTradeable !== undefined && (
                <span className={isTradeable ? "text-green-400" : "text-red-400"}>
                  {isTradeable ? "Tradeable" : "Not Tradeable"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm mt-4">
  {supply && (
    <div>
      <p className="text-gray-400">Total Supply</p>
      <p className="font-mono">{supply}</p>
    </div>
  )}
  {remainingSupply && (
    <div>
      <p className="text-gray-400">Remaining</p>
      <p className="font-mono">{remainingSupply}</p>
    </div>
  )}
  {onSaleCount && (
    <div>
      <p className="text-gray-400">On Sale</p>
      <p className="font-mono">{onSaleCount}</p>
    </div>
  )}
  {ownerCount !== undefined && (
    <div>
      <p className="text-gray-400">Owner Count</p>
      <p className="font-mono">{ownerCount}</p>
    </div>
  )}
  {createdAt && (
    <div>
      <p className="text-gray-400">Created At</p>
      <p className="font-mono">{formatDate(createdAt)}</p>
    </div>
  )}
  {floorAsk?.price?.amount?.decimal !== undefined && (
    <div>
      <p className="text-gray-400">Floor Price</p>
      <p className="font-mono">
        {floorAsk.price.amount.decimal} MON
      </p>
    </div>
  )}
  {royalty && (
    <div>
      <p className="text-gray-400">Royalty</p>
      <p className="font-mono">
        {royalty.bps ? `${royalty.bps / 100}%` : "N/A"}
      </p>
    </div>
  )}
  {chainData?.isMinting !== undefined && (
    <div>
      <p className="text-gray-400">Minting</p>
      <p className="font-mono">
        {chainData.isMinting ? "Active" : "Inactive"}
      </p>
    </div>
  )}
</div>

{volume && (
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
)}


        <div className="flex gap-4 mt-6">
        {websiteUrl && (
            <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 text-sm rounded-md font-mono transition"
            >
            Website
            </a>
        )}
        {discordLink && (
            <a
            href={discordLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 text-sm rounded-md font-mono transition"
            >
            Discord
            </a>
        )}
        {social?.twitterUsername && (
            <a
            href={`https://twitter.com/${social.twitterUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 text-sm rounded-md font-mono transition"
            >
            Twitter
            </a>
        )}
        </div>
    </div>
  );
}
