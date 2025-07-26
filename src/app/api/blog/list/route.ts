import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

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

    return NextResponse.json(validArticles);
  } catch (error) {
    console.error("Error listing articles:", error);
    return NextResponse.json(
      { message: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}