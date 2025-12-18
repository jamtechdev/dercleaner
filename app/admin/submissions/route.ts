import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/app/lib/adminAuth";
import { getContactSubmissions } from "@/app/lib/site";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const submissions = await getContactSubmissions();

  return new NextResponse(JSON.stringify(submissions, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=contact-submissions.json",
    },
  });
}
