import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

// Disable caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: "articles/",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const articles = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          const article = await response.json();
          return article;
        } catch (error) {
          console.error(`Error fetching article ${blob.pathname}:`, error);
          return null;
        }
      })
    );

    const validArticles = articles.filter(Boolean);

    const response = NextResponse.json(validArticles);
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Error listing articles:", error);
    return NextResponse.json(
      { message: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}