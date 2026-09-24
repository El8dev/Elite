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

/**
 * Write the sitemap everywhere it has to exist.
 *
 * This script runs in `postbuild`, i.e. after `vite build` has already copied
 * public/ into dist/. Writing only to public/ therefore meant the deployed
 * sitemap was always the previous build's file. Write to dist/ as well (when a
 * build is present) so what ships is what was just generated.
 */
function writeSitemap(xml) {
  const targets = [path.resolve(__dirname, '../public')];
  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) targets.push(distDir);

  for (const dir of targets) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), xml);
    console.log(`Sitemap written to ${path.relative(path.resolve(__dirname, '..'), dir)}/sitemap.xml`);
  }
}

const BASE_URL = 'https://el8.dev';

async function generateSitemap() {
  console.log('Generating sitemap...');

  const urls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/projects`, priority: '0.9', changefreq: 'daily' },
    // Static case studies. They exist in the bundle, so they are always valid
    // regardless of whether the database below can be reached.
    { loc: `${BASE_URL}/project/hawza`, priority: '0.9', changefreq: 'monthly' },
    { loc: `${BASE_URL}/project/raqeem`, priority: '0.9', changefreq: 'monthly' },
  ];

  try {
    // Developer profiles are deliberately absent: there is no /developer route
    // in src/routes.tsx, so listing them here would submit soft 404s.

    // Fetch public projects
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

    writeSitemap(sitemap);
    console.log(`Sitemap generated with ${urls.length} URLs.`);

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

    writeSitemap(sitemap);
    console.log(`Static fallback sitemap generated with ${urls.length} URLs.`);
  }
}

generateSitemap();
