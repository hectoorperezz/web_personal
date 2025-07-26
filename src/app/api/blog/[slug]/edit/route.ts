import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { title, summary, content } = await request.json();
    const { slug: oldSlug } = params;

    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Title, summary, and content are required" },
        { status: 400 }
      );
    }

    const newSlug = generateSlug(title);
    const publishedAt = new Date().toISOString().split("T")[0];

    const article = {
      metadata: {
        title,
        summary,
        publishedAt,
      },
      content,
      slug: newSlug,
    };

    // If slug changed, delete the old article
    if (oldSlug !== newSlug) {
      try {
        await del(`articles/${oldSlug}.json`, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (error) {
        console.log("Old article not found, continuing with update");
      }
    }

    // Create/update the article with new slug
    const { url } = await put(
      `articles/${newSlug}.json`,
      JSON.stringify(article),
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    return NextResponse.json({
      message: "Article updated successfully",
      slug: newSlug,
      url,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { message: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    await del(`articles/${slug}.json`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { message: "Failed to delete article" },
      { status: 500 }
    );
  }
}