import menuData from '@/data/json-responses/menu1.json' assert { type: 'json' };

export async function GET(request: Request) {
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