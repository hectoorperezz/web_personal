require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { put } = require('@vercel/blob');

async function migrateArticles() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

  console.log(`Found ${files.length} articles to migrate:`);
  files.forEach(file => console.log(`- ${file}`));

  for (const file of files) {
    try {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { content, data: metadata } = matter(fileContent);
      const slug = path.basename(file, '.mdx');

      const article = {
        metadata: {
          title: metadata.title,
          summary: metadata.summary,
          publishedAt: metadata.publishedAt,
        },
        content,
        slug,
      };

      console.log(`\nMigrating: ${slug}`);
      console.log(`Title: ${metadata.title}`);
      console.log(`Published: ${metadata.publishedAt}`);

      const { url } = await put(
        `articles/${slug}.json`,
        JSON.stringify(article),
        {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        }
      );

      console.log(`✅ Successfully migrated to: ${url}`);
    } catch (error) {
      console.error(`❌ Error migrating ${file}:`, error.message);
    }
  }

  console.log('\n🎉 Migration completed!');
}

// Run the migration
migrateArticles().catch(console.error);