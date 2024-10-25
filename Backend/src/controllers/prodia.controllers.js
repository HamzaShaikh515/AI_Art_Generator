import { createProdia } from 'prodia'; // Ensure this is imported

const prodia = createProdia({
    apiKey: '80f9acde-a9e4-4130-89f2-87ae43e4b40d', // Replace with your actual API key
});

export const imageGenerator = async (req, res) => {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    try {
        // Optionally simplify the prompt or add a fallback
        const enhancedPrompt = `${prompt}. High-resolution, photorealistic textures`; // Simplified for performance

        const job = await prodia.generate({
            prompt: enhancedPrompt,
            model: "v1-5-pruned-emaonly.safetensors [d7049739]",
            n: 1,
            size: "1024x1024", // Reduced size for faster generation
        });

        console.log('Job created:', job);
        
        // Wait for the job to complete and retrieve the image URL
        const { imageUrl, status } = await prodia.wait(job);
        console.log('Job status:', status);

        if (status === 'succeeded' && imageUrl) {
            res.json({ imageUrl });
        } else {
            res.status(500).json({ error: `Image generation failed. Job status: ${status}` });
        }
    } catch (error) {
        // Improved error logging
        console.error('Error generating image:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error generating image: ' + (error.response?.data || error.message) });
    }
};
