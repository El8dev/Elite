import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://el8.dev';

async function generateSitemap() {
  console.log('Generating sitemap...');

  const urls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/projects`, priority: '0.9', changefreq: 'daily' },
  ];

  try {
    // 1. Fetch approved developers
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('account_status', 'approved');

    if (profilesError) throw profilesError;

    if (profiles) {
      profiles.forEach((profile) => {
        const identifier = profile.username || profile.id;
        urls.push({
          loc: `${BASE_URL}/developer/${identifier}`,
          priority: '0.8',
          changefreq: 'weekly',
        });
      });
    }

    // 2. Fetch public projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .eq('personal_profile_only', false);

    if (projectsError) throw projectsError;

    if (projects) {
      projects.forEach((project) => {
        urls.push({
          loc: `${BASE_URL}/project/${project.id}`,
          priority: '0.7',
          changefreq: 'monthly',
        });
      });
    }

    // Build XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    urls.forEach((url) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${url.loc}</loc>\n`;
      sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${url.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log(`Sitemap generated successfully at public/sitemap.xml with ${urls.length} URLs.`);

  } catch (err) {
    console.warn('Network error during sitemap generation (using static routes):', err.message || err);
    
    // Build fallback XML with base static routes
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    urls.forEach((url) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${url.loc}</loc>\n`;
      sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${url.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log(`Static fallback sitemap generated at public/sitemap.xml.`);
  }
}

generateSitemap();
