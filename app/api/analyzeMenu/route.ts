import extractForm from '@/data/extract-form.json' assert { type: 'json' };
import menuData from '@/data/json-responses/menu1.json' assert { type: 'json' };
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
	try {
		console.log('Request body:', request.body);
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

export async function getLocalData(request: Request) {
	console.log('Fetching local data');
	try {
		// Check if the USE_LOCAL_DATA environment variable is set
		if (process.env.USE_LOCAL_DATA === 'true') {
			console.log('Returning local data based on USE_LOCAL_DATA flag');
			return new Response(JSON.stringify(menuData), {
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			// If USE_LOCAL_DATA is not set, return a message or null data
			console.log('USE_LOCAL_DATA flag is not set, no local data returned');
			return new Response(JSON.stringify({ message: 'No local data returned', data: null }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	} catch (error: any) {
		console.error('Error while fetching local data:', error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}