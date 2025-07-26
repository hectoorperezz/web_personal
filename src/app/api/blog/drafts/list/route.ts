import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

// Disable caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    const response = NextResponse.json(validDrafts);
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Error listing drafts:", error);
    return NextResponse.json(
      { message: "Failed to list drafts" },
      { status: 500 }
    );
  }
}