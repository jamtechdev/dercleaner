import { NextResponse } from "next/server";
import { getSite } from "@/app/lib/site";

export async function GET() {
  const site = await getSite();
  return NextResponse.json(site);
}
