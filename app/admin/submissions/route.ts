import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/app/lib/adminAuth";
import { getContactSubmissions } from "@/app/lib/site";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "csv";
  const submissions = await getContactSubmissions();

  if (format === "csv") {
    // Simple CSV conversion
    const headers = ["Date", "Name", "Email", "Phone", "Message"];
    const rows = submissions.map((s) => [
      s.createdAt ? new Date(s.createdAt).toISOString() : "",
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${(s.email || "").replace(/"/g, '""')}"`,
      `"${(s.tel || "").replace(/"/g, '""')}"`,
      `"${(s.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=contact-submissions.csv",
      },
    });
  }

  // Default to JSON if format=json is requested
  return new NextResponse(JSON.stringify(submissions, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": "attachment; filename=contact-submissions.json",
    },
  });
}
