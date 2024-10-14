const TOGETHER_API_KEY = "5398cce1d3ef06e8f4480c4c78ba0dfa4eb13bc472c92d0c3e430e3c274e8f35";

async function generateImage(prompt, resolution, style, negativePrompt) {
    const [width, height] = resolution.split('x'); // Extract width and height

    // Make the API request
    const response = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + TOGETHER_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "black-forest-labs/FLUX.1-schnell-Free",
            prompt: prompt,
            width: parseInt(width),
            height: parseInt(height),
            steps: 4,
            n: 1,
            response_format: "b64_json"
        })
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0 && data.data[0].b64_json) {
        return data.data[0].b64_json; // Return the base64 image string
    } else {
        throw new Error("No image data returned.");
    }
}

async function submitQuery() {
    const queryInput = document.getElementById('queryInput').value;
    const resolutionSelect = document.getElementById('resolutionSelect').value;
    const imageStyleSelect = document.getElementById('imageStyleSelect').value;
    const negativePromptInput = document.getElementById('negativePromptInput').value;

    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'block';

    try {
        const imageBase64 = await generateImage(queryInput, resolutionSelect, imageStyleSelect, negativePromptInput);
        
        loadingSpinner.style.display = 'none';

        const generatedImage = document.getElementById('generatedImage');
        generatedImage.src = `data:image/png;base64,${imageBase64}`;
        generatedImage.style.display = 'block';

        const downloadButton = document.getElementById('downloadButton');
        downloadButton.style.display = 'block';
    } catch (error) {
        console.error("Error generating image:", error);
        loadingSpinner.style.display = 'none';
        alert("Failed to generate the image. Please try again.");
    }
}

function downloadImage() {
    const generatedImage = document.getElementById('generatedImage');
    const link = document.createElement('a');
    link.href = generatedImage.src;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
