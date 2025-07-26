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

// Update draft
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { title, summary, content } = await request.json();
    const { slug: oldSlug } = params;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    const newSlug = generateSlug(title);
    const savedAt = new Date().toISOString();

    const draft = {
      metadata: {
        title,
        summary: summary || "",
        savedAt,
        status: "draft" as const,
      },
      content,
      slug: newSlug,
    };

    // If slug changed, delete the old draft
    if (oldSlug !== newSlug) {
      try {
        await del(`drafts/${oldSlug}.json`, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (error) {
        console.log("Old draft not found, continuing with update");
      }
    }

    // Create/update the draft with new slug
    const { url } = await put(
      `drafts/${newSlug}.json`,
      JSON.stringify(draft),
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    return NextResponse.json({
      message: "Draft updated successfully",
      slug: newSlug,
      url,
      savedAt,
    });
  } catch (error) {
    console.error("Error updating draft:", error);
    return NextResponse.json(
      { message: "Failed to update draft" },
      { status: 500 }
    );
  }
}

// Delete draft
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    await del(`drafts/${slug}.json`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      message: "Draft deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting draft:", error);
    return NextResponse.json(
      { message: "Failed to delete draft" },
      { status: 500 }
    );
  }
}

// Publish draft (move from drafts to articles)
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // First, get the draft
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({
      prefix: `drafts/${slug}.json`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (blobs.length === 0) {
      return NextResponse.json(
        { message: "Draft not found" },
        { status: 404 }
      );
    }

    const response = await fetch(blobs[0].url);
    const draft = await response.json();

    // Create published article
    const publishedAt = new Date().toISOString().split("T")[0];
    const article = {
      metadata: {
        title: draft.metadata.title,
        summary: draft.metadata.summary,
        publishedAt,
      },
      content: draft.content,
      slug: draft.slug,
    };

    // Save as published article
    const { url } = await put(
      `articles/${draft.slug}.json`,
      JSON.stringify(article),
      {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    // Delete the draft
    await del(`drafts/${slug}.json`, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      message: "Draft published successfully",
      slug: draft.slug,
      url,
      publishedAt,
    });
  } catch (error) {
    console.error("Error publishing draft:", error);
    return NextResponse.json(
      { message: "Failed to publish draft" },
      { status: 500 }
    );
  }
}