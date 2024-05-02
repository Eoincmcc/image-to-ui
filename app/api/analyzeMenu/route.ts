import extractForm from '@/data/extract-form.json' assert { type: 'json' };
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
	try {
		const { image } = await request.json();

		const formatDescription = JSON.stringify(extractForm, null, 2);

		const response = await openai.chat.completions.create({
			model: "gpt-4-turbo",
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
							url: image
						}
					}]
				}
			],
			response_format: { 'type': 'json_object' },
		});

		// Ensure that a response object is returned in the correct format
		return new Response(response.choices[0].message.content);
	} catch (error: any) {
		console.error('Error handling request:', error);

		// Return a JSON response with the error message and a 500 status code
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}