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

    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Title, summary, and content are required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const publishedAt = new Date().toISOString().split("T")[0];

    const article = {
      metadata: {
        title,
        summary,
        publishedAt,
      },
      content,
      slug,
    };

    const { url } = await put(
      `articles/${slug}.json`,
      JSON.stringify(article),
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    return NextResponse.json({
      message: "Article published successfully",
      slug,
      url,
    });
  } catch (error) {
    console.error("Error publishing article:", error);
    return NextResponse.json(
      { message: "Failed to publish article" },
      { status: 500 }
    );
  }
}