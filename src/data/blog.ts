import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  // For build time, only use static posts
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    const filePath = path.join("content", `${slug}.mdx`);
    let source = fs.readFileSync(filePath, "utf-8");
    const { content: rawContent, data: metadata } = matter(source);
    const content = await markdownToHTML(rawContent);
    return {
      source: content,
      metadata,
      slug,
    };
  }

  // First try to fetch from blob storage directly
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({
      prefix: `articles/${slug}.json`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      const article = await response.json();
      const content = await markdownToHTML(article.content);
      return {
        source: content,
        metadata: article.metadata,
        slug: article.slug,
      };
    }
  } catch (error) {
    console.log("Article not found in blob storage, trying static files...");
  }

  // Fall back to static files
  try {
    const filePath = path.join("content", `${slug}.mdx`);
    let source = fs.readFileSync(filePath, "utf-8");
    const { content: rawContent, data: metadata } = matter(source);
    const content = await markdownToHTML(rawContent);
    return {
      source: content,
      metadata,
      slug,
    };
  } catch (error) {
    throw new Error(`Post not found: ${slug}`);
  }
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      let { metadata, source } = await getPost(slug);
      return {
        metadata,
        slug,
        source,
      };
    }),
  );
}

export async function getBlogPosts() {
  // For build time, only use static posts
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    return getAllPosts(path.join(process.cwd(), "content"));
  }

  // Get posts from blob storage directly
  let blobPosts = [];
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({
      prefix: "articles/",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    blobPosts = await Promise.all(
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

    blobPosts = blobPosts.filter(Boolean);
  } catch (error) {
    console.log("Could not fetch from blob storage, using static files only");
  }

  // Get static posts
  const staticPosts = await getAllPosts(path.join(process.cwd(), "content"));

  // Combine and deduplicate (blob posts take priority)
  const allPosts = [...blobPosts];
  const blobSlugs = new Set(blobPosts.map((post: any) => post.slug));
  
  staticPosts.forEach((post) => {
    if (!blobSlugs.has(post.slug)) {
      allPosts.push(post);
    }
  });

  return allPosts;
}
