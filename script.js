document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const memeTemplateSelect = document.getElementById('meme-template');
    const topTextInput = document.getElementById('top-text');
    const bottomTextInput = document.getElementById('bottom-text');
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
    fetchTrendingMemes();
    
    // Event Listeners
    generateBtn.addEventListener('click', generateMeme);
    randomBtn.addEventListener('click', generateRandomMeme);
    downloadBtn.addEventListener('click', downloadMeme);
    memeTemplateSelect.addEventListener('change', onTemplateChange);
    
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
        if (memeTemplates.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * memeTemplates.length);
        currentMeme = memeTemplates[randomIndex];
        memeTemplateSelect.value = currentMeme.id;
        
        // Fun random text suggestions
        const topTexts = [
            "WHEN YOU SEE IT", 
            "ME: DOES THE DISHES", 
            "WHEN YOUR CODE WORKS", 
            "HOW I IMAGINED VS HOW IT WENT"
        ];
        
        const bottomTexts = [
            "STILL DON'T SEE IT", 
            "WIFE: LOOKS AT THE DISHES", 
            "VS HOW IT ACTUALLY WORKS", 
            "REALITY IS OFTEN DISAPPOINTING"
        ];
        
        topTextInput.value = topTexts[Math.floor(Math.random() * topTexts.length)];
        bottomTextInput.value = bottomTexts[Math.floor(Math.random() * bottomTexts.length)];
        
        generateMeme();
    }
    
    function generateMeme() {
        if (!currentMeme) return;
        
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
            
            const fontSize = canvas.width / 10;
            ctx.font = `bold ${fontSize}px Impact, sans-serif`;
            
            // Top text
            if (topTextInput.value) {
                ctx.fillText(topTextInput.value.toUpperCase(), canvas.width / 2, fontSize);
                ctx.strokeText(topTextInput.value.toUpperCase(), canvas.width / 2, fontSize);
            }
            
            // Bottom text
            if (bottomTextInput.value) {
                ctx.fillText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - fontSize / 2);
                ctx.strokeText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - fontSize / 2);
            }
        };
    }
    
    function downloadMeme() {
        if (!currentMeme) return;
        
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