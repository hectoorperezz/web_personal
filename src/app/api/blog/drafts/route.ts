import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const { title, summary, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required for draft" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const savedAt = new Date().toISOString();

    const draft = {
      metadata: {
        title,
        summary: summary || "",
        savedAt,
        status: "draft" as const,
      },
      content,
      slug,
    };

    // Save as draft with different prefix
    const { url } = await put(
      `drafts/${slug}.json`,
      JSON.stringify(draft),
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    return NextResponse.json({
      message: "Draft saved successfully",
      slug,
      url,
      savedAt,
    });
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      { message: "Failed to save draft" },
      { status: 500 }
    );
  }
}