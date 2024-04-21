const fs = require('fs-extra');
const officegen = require('officegen');
const path = require('path');

const directoryToWatch = "/Users/milesbloom/Library/Mobile Documents/com~apple~CloudDocs/Continuous";
const outputFolder = "/Users/milesbloom/Library/Mobile Documents/com~apple~CloudDocs/Continuous/output";

async function convertPptToImages(pptFilePath, outputFolder) {
    try {
        const tempPptxPath = path.join(outputFolder, 'temp.pptx');
        
        // Copy the PowerPoint file to a temporary location
        await fs.copy(pptFilePath, tempPptxPath);

        // Create officegen instance
        const pptx = officegen('pptx');

        // Load the PowerPoint file
        pptx.load(tempPptxPath);

        // Process the loaded PowerPoint object as before
        const slides = pptx.slides;
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            const slideImagePath = `${outputFolder}/slide_${i + 1}.png`;
            const slideImageBuffer = await slide.render({ type: 'png' });

            await fs.writeFile(slideImagePath, slideImageBuffer);
            console.log(`Slide ${i + 1} converted to image: ${slideImagePath}`);
        }

        console.log('Conversion completed!');

        // Remove the temporary PowerPoint file
        await fs.remove(tempPptxPath);
    } catch (err) {
        console.error('Error converting PowerPoint to images:', err);
    }
}

fs.watch(directoryToWatch, (eventType, filename) => {
    if (eventType === 'rename') {
        const filePath = path.join(directoryToWatch, filename);
        fs.stat(filePath, (err, stats) => {
            if (!err && stats.isFile()) {
                console.log(`New file detected: ${filename}`);
                if (filename.endsWith(".pptx")) {
                    convertPptToImages(filePath, outputFolder);
                }
            }
        });
    }
});

console.log(`Watching directory: ${directoryToWatch}`);
