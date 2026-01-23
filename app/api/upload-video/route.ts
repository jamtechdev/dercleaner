import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { isAdminAuthed } from "@/app/lib/adminAuth";

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

// Allowed video MIME types
const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov files
  "video/x-msvideo", // .avi files
];

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdminAuthed())) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei bereitgestellt" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      return NextResponse.json(
        { error: `Dateigröße überschreitet das maximale Limit von ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Ungültiger Dateityp. Nur Videodateien sind erlaubt." },
        { status: 400 }
      );
    }

    // Create videos directory if it doesn't exist
    const videosDir = join(process.cwd(), "public", "videos");
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true });
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    // Get file extension from original name or MIME type
    let fileExtension = originalName.split(".").pop()?.toLowerCase() || "mp4";
    
    // Map MIME types to extensions if extension is missing or invalid
    const mimeToExt: Record<string, string> = {
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/ogg": "ogg",
      "video/quicktime": "mov",
      "video/x-msvideo": "avi",
    };
    
    if (!fileExtension || !["mp4", "webm", "ogg", "mov", "avi"].includes(fileExtension)) {
      fileExtension = mimeToExt[file.type] || "mp4";
    }
    
    const fileName = `video_${timestamp}.${fileExtension}`;
    const filePath = join(videosDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Verify file was written
    if (!existsSync(filePath)) {
      throw new Error("Datei konnte nicht gespeichert werden");
    }

    // Return the public URL path (Next.js serves files from public/ at root)
    // Ensure the path starts with / and doesn't have double slashes
    const publicUrl = `/videos/${fileName}`.replace(/\/+/g, '/');

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      message: "Video erfolgreich hochgeladen. Die Datei wird nach dem Speichern der Einstellungen verfügbar sein.",
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "Video-Upload fehlgeschlagen" },
      { status: 500 }
    );
  }
}
