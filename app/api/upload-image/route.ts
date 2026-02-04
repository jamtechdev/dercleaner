import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { isAdminAuthed } from "@/app/lib/adminAuth";

// Maximum file size: 10MB for images
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Allowed image MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdminAuthed())) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const folder = String(formData.get("folder") ?? "uploads").replace(/[^a-zA-Z0-9_-]/g, "");

    if (!file) {
      return NextResponse.json({ error: "Keine Datei bereitgestellt" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      return NextResponse.json(
        { error: `Dateigröße überschreitet das maximale limit von ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Ungültiger Dateityp. Nur Bilddateien sind erlaubt (JPEG, PNG, GIF, WebP, SVG)." },
        { status: 400 }
      );
    }

    // Create target directory based on folder parameter
    const imagesDir = join(process.cwd(), "public", "images", folder);
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    let fileExtension = originalName.split(".").pop()?.toLowerCase() || "jpg";

    // Map MIME types if needed
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
    };

    if (!fileExtension || !["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileExtension)) {
      fileExtension = mimeToExt[file.type] || "jpg";
    }

    // Generic prefix instead of hardcoded 'product_'
    const fileName = `img_${timestamp}.${fileExtension}`;
    const filePath = join(imagesDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Verify file was written
    if (!existsSync(filePath)) {
      throw new Error("Datei konnte nicht gespeichert werden");
    }

    // Return the public URL path
    const publicUrl = `/images/${folder}/${fileName}`.replace(/\/+/g, '/');

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      message: "Bild erfolgreich hochgeladen.",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Bild-Upload fehlgeschlagen" },
      { status: 500 }
    );
  }
}
