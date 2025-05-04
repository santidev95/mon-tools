import { NextRequest, NextResponse } from 'next/server';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { addresses } = body;

  if (!Array.isArray(addresses)) {
    return new NextResponse("Invalid body", { status: 400 });
  }

  const leaves = addresses.map(addr => keccak256(addr.toLowerCase()));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getHexRoot();

  const proofs: Record<string, string[]> = {};
  addresses.forEach(addr => {
    const leaf = keccak256(addr.toLowerCase());
    const proof = tree.getHexProof(leaf);
    proofs[addr.toLowerCase()] = proof;
  });

  return NextResponse.json({ root, proofs });
}
