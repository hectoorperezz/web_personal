import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: "drafts/",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const drafts = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          const draft = await response.json();
          return draft;
        } catch (error) {
          console.error(`Error fetching draft ${blob.pathname}:`, error);
          return null;
        }
      })
    );

    // Filter out failed fetches and sort by savedAt
    const validDrafts = drafts
      .filter(Boolean)
      .sort((a, b) => new Date(b.metadata.savedAt).getTime() - new Date(a.metadata.savedAt).getTime());

    return NextResponse.json(validDrafts);
  } catch (error) {
    console.error("Error listing drafts:", error);
    return NextResponse.json(
      { message: "Failed to list drafts" },
      { status: 500 }
    );
  }
}