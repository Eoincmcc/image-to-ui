require('dotenv').config();
const axios = require('axios');

import { response } from 'express';
import extractForm from './data/extract-form.json' assert { type: 'json' };

const openAiApi = axios.create({
  baseURL: 'https://api.openai.com/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
});

// use image stored at image-to-ui/data/test-images/menu1.jpg

async function fetchMenuDataFromImage(imageUrl) {
    const absolutePath = path.join(__dirname, imagePath);
    const imageBuffer = fs.readFileSync(absolutePath);
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    formatDescription = JSON.stringify(extractForm, null, 2);

    const payload = {
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "system",
                content: `You are a restaurant owner who wants to digitize their menu into English. You have an image of a menu and want to convert it to json in the format: ${formatDescription}`
            },
            {
                role: "user",
                content: [{
                    type: "text",
                    text: "Extract the menu from this image."
                }, {
                    type: "image_url",
                    image_url: {
                        url: `data:image/jpeg;base64,${base64Image}`
                    }
                }]
            }],
        response_format: { 'type': 'json_object' },
    };

  try {
    const response = await openAiApi.post('chat/completions', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    return null;
  }
}

module.exports = { fetchMenuDataFromImage };
