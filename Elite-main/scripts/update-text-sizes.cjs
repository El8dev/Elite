const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplaceInDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            findAndReplaceInDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Replace text-[10px], text-[11px], text-[8px] with text-xs md:text-sm or text-sm
            content = content.replace(/text-\[11px\]/g, 'text-sm');
            content = content.replace(/text-\[10px\]/g, 'text-xs md:text-sm');
            content = content.replace(/text-\[8px\]/g, 'text-xs');
            
            // Adjust padding on badges to keep them from growing too large
            content = content.replace(/px-2\.5 py-1/g, 'px-1.5 py-0.5');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

findAndReplaceInDirectory(directoryPath);
console.log('Done replacing small text utility classes.');
