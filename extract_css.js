const fs = require('fs');
const path = require('path');

// Configuration
const htmlFiles = ['index.html', 'pricing.html'];
const cssInputPath = 'src/input.css'; // Adjust if your tailwind input is elsewhere

// Regex to capture style blocks content
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;

function processFiles() {
    let extractedCss = '\n/* Extracted from HTML files */\n';

    htmlFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            let match;
            
            // 1. Extract CSS
            while ((match = styleRegex.exec(content)) !== null) {
                extractedCss += `\n/* From ${file} */\n${match[1].trim()}\n`;
            }

            // 2. Remove Style Tags from HTML
            const newContent = content.replace(styleRegex, '');
            fs.writeFileSync(filePath, newContent);
            console.log(`✅ Processed ${file} (removed <style> blocks)`);
        } else {
            console.warn(`⚠️ File not found: ${file}`);
        }
    });

    // 3. Append to input.css
    const cssPath = path.join(__dirname, cssInputPath);
    if (fs.existsSync(cssPath)) {
        fs.appendFileSync(cssPath, extractedCss);
        console.log(`✅ Appended styles to ${cssInputPath}`);
    } else {
        console.error(`❌ CSS Input file not found: ${cssPath}`);
    }
}

processFiles();
