import { fetchMagicEdenCollection } from "@/lib/clients/magicEdenClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { contract: string } }
) {
  const data = await fetchMagicEdenCollection(params.contract);

  if (!data) {
    return new NextResponse("Collection not found", { status: 404 });
  }

  return NextResponse.json(data);
}
