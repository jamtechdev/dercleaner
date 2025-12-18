import { NextResponse } from "next/server";
import site from "@/app/content/site.json";

export function GET() {
  return NextResponse.json(site);
}
