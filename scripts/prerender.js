import puppeteer from 'puppeteer';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Setup environment and paths
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const port = 4173;

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function getDynamicRoutes() {
  console.log('Fetching projects from Supabase for dynamic routes...');
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('personal_profile_only', false);

    if (error) {
      console.error('Error fetching projects from Supabase response:', error.message);
      return [];
    }
    return data.map(project => `/project/${project.id}`);
  } catch (err) {
    console.error('Exception fetching projects:', err.message || err);
    return [];
  }
}

async function run() {
  const staticRoutes = ['/', '/projects'];
  const dynamicRoutes = await getDynamicRoutes();
  const routes = [...staticRoutes, ...dynamicRoutes];

  console.log(`Starting prerender for ${routes.length} routes...`);

  // Start Express server
  const app = express();
  
  // Serve static files from dist
  app.use(express.static(distPath));
  
  // For any other route, serve the root index.html (SPA fallback)
  app.use((req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });

  const server = app.listen(port, async () => {
    console.log(`Server started at http://localhost:${port}`);
    
    let browser;
    try {
      browser = await puppeteer.launch({ headless: 'new' });
      
      for (const route of routes) {
        console.log(`Prerendering ${route}...`);
        const page = await browser.newPage();
        
        // Block unnecessary resources for faster prerendering
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          if (['image', 'media', 'font'].includes(req.resourceType())) {
            req.continue(); // Let them load so UI doesn't look broken if it matters, or abort to speed up.
          } else {
            req.continue();
          }
        });

        await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait an extra second for any animations or state updates to settle
        await new Promise(r => setTimeout(r, 1000));
        
        let html = await page.content();
        
        // We can inject a small script to tell React that the page is pre-rendered if needed,
        // but react-helmet and other tools handle this generally well.
        
        // Determine save path
        const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
        const filePath = path.join(distPath, routePath);
        
        // Ensure directory exists
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        
        // Save file
        fs.writeFileSync(filePath, html);
        console.log(`Saved ${filePath}`);
        
        await page.close();
      }
      
      console.log('Prerendering complete!');
    } catch (err) {
      console.error('Prerendering failed:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
    }
  });
}

run();
