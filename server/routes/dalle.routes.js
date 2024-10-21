import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

dotenv.config();

const router = express.Router();

console.log('API Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 'N/A');

if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is missing. Please check your .env file.');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.use(apiLimiter);

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from DALL-E routes' });
});

router.route('/').post(async (req, res) => {
    console.log('Received POST request to /api/v1/dalle');
    try {
        const { prompt } = req.body;
        console.log('Received prompt:', prompt);

        if (!prompt) {
            return res.status(400).json({ message: 'No prompt provided' });
        }

        console.log('Generating image...');
        const response = await openai.images.generate({
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        });
        console.log('Image generated successfully');

        if (!response.data || response.data.length === 0 || !response.data[0].b64_json) {
            console.error('Unexpected response format:', JSON.stringify(response));
            throw new Error('Unexpected response format from OpenAI');
        }

        const image = response.data[0].b64_json;
        
        // Add these lines for more detailed logging
        console.log('Image data length:', image.length);
        console.log('Image data starts with:', image.substring(0, 50)); // Log the first 50 characters

        console.log('Sending response back to client');
        res.status(200).json({ photo: image });

    } catch (error) {
        console.error('Error in DALL-E route:', error);
        if (error.response) {
            console.error('OpenAI API error response:', error.response.data);
        }
        res.status(error.response?.status || 500).json({ 
            message: "Something went wrong", 
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
        });
    }
});

// Test route
router.route('/test').get(async (req, res) => {
    try {
        const response = await openai.models.list();
        res.status(200).json({ 
            message: 'DALL-E route is working',
            openaiStatus: 'Connected',
            models: response.data.slice(0, 5) // Just send the first 5 models
        });
    } catch (error) {
        console.error('Error testing OpenAI connection:', error);
        res.status(500).json({ 
            message: 'DALL-E route is working, but OpenAI connection failed',
            error: error.message
        });
    }
});

router.route('/test-image').get(async (req, res) => {
    try {
        const response = await openai.images.generate({
            prompt: "A simple test image of a blue circle",
            n: 1,
            size: "256x256",
            response_format: "b64_json",
        });

        if (!response.data || response.data.length === 0 || !response.data[0].b64_json) {
            throw new Error('Unexpected response format from OpenAI');
        }

        const image = response.data[0].b64_json;
        res.status(200).json({ 
            message: 'Test image generated successfully',
            imageData: `data:image/png;base64,${image}`
        });
    } catch (error) {
        console.error('Error generating test image:', error);
        res.status(500).json({ 
            message: 'Failed to generate test image',
            error: error.message
        });
    }
});

export default router;
