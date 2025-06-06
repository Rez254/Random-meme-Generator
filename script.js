document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const memeTemplateSelect = document.getElementById('meme-template');
    const memeTextInput = document.getElementById('meme-text');
    const generateBtn = document.getElementById('generate-btn');
    const randomBtn = document.getElementById('random-btn');
    const downloadBtn = document.getElementById('download-btn');
    const canvas = document.getElementById('meme-canvas');
    const ctx = canvas.getContext('2d');
    const trendingMemesContainer = document.getElementById('trending-memes');
    
    // State
    let memeTemplates = [];
    let currentMeme = null;
    
    // Initialize
    if (
        memeTemplateSelect &&
        memeTextInput &&
        generateBtn &&
        randomBtn &&
        downloadBtn &&
        canvas &&
        ctx &&
        trendingMemesContainer
    ) {
        fetchTrendingMemes();

        // Event Listeners
        generateBtn.addEventListener('click', generateMeme);
        randomBtn.addEventListener('click', generateRandomMeme);
        downloadBtn.addEventListener('click', downloadMeme);
        memeTemplateSelect.addEventListener('change', onTemplateChange);
    } else {
        console.error('One or more DOM elements are missing. Please check your HTML.');
    }

    // Reduce meme text font size for better readability
    // Change font size calculation in generateMeme
    const originalGenerateMeme = generateMeme;
    generateMeme = function() {
        if (!currentMeme || !currentMeme.url) return;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = currentMeme.url;

        img.onload = function() {
            const maxWidth = 500;
            const ratio = img.width > 0 ? maxWidth / img.width : 1;
            canvas.width = maxWidth;
            canvas.height = img.height * ratio;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = canvas.width / 100;
            ctx.textAlign = 'center';

            // Reduced font size (was canvas.width / 10, now / 18)
            const fontSize = Math.floor(canvas.width / 18);
            ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;

            if (memeTextInput.value) {
                const textLines = memeTextInput.value.split('\n');
                const verticalSpacing = fontSize * 1.5;
                const startY = canvas.height / 2 - ((textLines.length - 1) * verticalSpacing) / 2;

                textLines.forEach((line, index) => {
                    const yPosition = startY + (index * verticalSpacing);
                    const text = line.toUpperCase();

                    const textWidth = ctx.measureText(text).width;
                    const padding = 10;

                    ctx.save();
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(
                        canvas.width / 2 - textWidth / 2 - padding,
                        yPosition - fontSize / 2 - padding,
                        textWidth + padding * 2,
                        fontSize + padding * 2
                    );
                    ctx.restore();

                    drawTextLine(text, canvas.width / 2, yPosition);
                });
            }
        };
    };
    
    // Functions
    async function fetchTrendingMemes() {
        try {
            // Using Imgflip API to get popular meme templates
            const response = await fetch('https://api.imgflip.com/get_memes');
            const data = await response.json();
            
            if (data.success) {
                memeTemplates = data.data.memes;
                populateTemplateDropdown();
                displayTrendingMemes();
                generateRandomMeme();
            }
        } catch (error) {
            console.error('Error fetching memes:', error);
            // Fallback to some default memes if API fails
            memeTemplates = getDefaultMemes();
            populateTemplateDropdown();
            displayTrendingMemes();
            generateRandomMeme();
        }
    }
    
    function populateTemplateDropdown() {
        memeTemplateSelect.innerHTML = '';
        
        const randomOption = document.createElement('option');
        randomOption.value = 'random';
        randomOption.textContent = 'Random (Trending Today)';
        memeTemplateSelect.appendChild(randomOption);
        
        memeTemplates.forEach(meme => {
            const option = document.createElement('option');
            option.value = meme.id;
            option.textContent = meme.name;
            memeTemplateSelect.appendChild(option);
        });
    }
    
    function displayTrendingMemes() {
        trendingMemesContainer.innerHTML = '';
        
        // Show top 10 trending memes
        const trendingMemes = memeTemplates.slice(0, 10);
        
        trendingMemes.forEach(meme => {
            const memeElement = document.createElement('div');
            memeElement.className = 'trending-meme';
            
            const img = document.createElement('img');
            img.src = meme.url;
            img.alt = meme.name;
            img.loading = 'lazy';
            
            memeElement.appendChild(img);
            memeElement.addEventListener('click', () => {
                selectMemeTemplate(meme.id);
                generateMeme();
            });
            
            trendingMemesContainer.appendChild(memeElement);
        });
    }
    
    function selectMemeTemplate(memeId) {
        memeTemplateSelect.value = memeId;
        currentMeme = memeTemplates.find(meme => meme.id === memeId);
    }
    
    function onTemplateChange() {
        const selectedId = memeTemplateSelect.value;
        if (selectedId === 'random') {
            generateRandomMeme();
        } else {
            currentMeme = memeTemplates.find(meme => meme.id === selectedId);
            generateMeme();
        }
    }
    
function generateRandomMeme() {
    const randomIndex = Math.floor(Math.random() * memeTemplates.length);
    currentMeme = memeTemplates[randomIndex];
    memeTemplateSelect.value = currentMeme.id;
    
    // Fun random text suggestions
    const memeTexts = [
        "WHEN YOUR CODE WORKS\n VS HOW IT ACTUALLY WORKS",
        "HOW I IMAGINED IT\n VS \nHOW IT WENT",
        "EXPECTATION\n VS \nREALITY",
        "ME: DOES THE DISHES \n WIFE: LOOKS AT THE DISHES",
        "STARTS PROJECT\n VS \nFINISHES PROJECT"
    ];
    memeTextInput.value = memeTexts[Math.floor(Math.random() * memeTexts.length)];
    generateMeme();
}
    
    function generateMeme() {
        if (!currentMeme || !currentMeme.url) return;
        
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = currentMeme.url;
        
        img.onload = function() {
            // Set canvas dimensions
            const maxWidth = 500;
            const ratio = img.width > 0 ? maxWidth / img.width : 1;
            canvas.width = maxWidth;
            canvas.height = img.height * ratio;
            
            // Draw image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Text styling
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = canvas.width / 100;
            ctx.textAlign = 'center';
    
            // Dynamically set font size based on canvas width
            const fontSize = Math.floor(canvas.width / 10);
            ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
    
if (memeTextInput.value) {
    const textLines = memeTextInput.value.split('\n');
    const verticalSpacing = fontSize * 1.5;
    const startY = canvas.height / 2 - ((textLines.length - 1) * verticalSpacing) / 2;
    
    textLines.forEach((line, index) => {
        const yPosition = startY + (index * verticalSpacing);
        const text = line.toUpperCase();
        
        // Measure text width for background
        const textWidth = ctx.measureText(text).width;
        const padding = 10;
        
        // Draw background
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(
            canvas.width / 2 - textWidth / 2 - padding,
            yPosition - fontSize / 2 - padding,
            textWidth + padding * 2,
            fontSize + padding * 2
        );
        ctx.restore();
        
        // Draw text
        drawTextLine(text, canvas.width / 2, yPosition);
    });
}
        };
    }
    function drawTextLine(text, x, y) {
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}
    
    function downloadMeme() {
        if (!currentMeme || !currentMeme.url) return;
        
        const link = document.createElement('a');
        link.download = `meme-${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    }
    
    // Fallback meme data if API fails
    function getDefaultMemes() {
        return [
            {
                id: '181913649',
                name: 'Drake Hotline Bling',
                url: 'https://i.imgflip.com/30b1gx.jpg',
                width: 1200,
                height: 1200
            },
            {
                id: '87743020',
                name: 'Two Buttons',
                url: 'https://i.imgflip.com/1g8my4.jpg',
                width: 600,
                height: 908
            },
            {
                id: '112126428',
                name: 'Distracted Boyfriend',
                url: 'https://i.imgflip.com/1ihzfe.jpg',
                width: 1200,
                height: 800
            },
            {
                id: '131087935',
                name: 'Running Away Balloon',
                url: 'https://i.imgflip.com/261o3j.jpg',
                width: 761,
                height: 1024
            },
            {
                id: '247375501',
                name: 'Buff Doge vs. Cheems',
                url: 'https://i.imgflip.com/43a45p.png',
                width: 937,
                height: 720
            }
        ];
    }
});