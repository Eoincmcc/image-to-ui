import {
	FunctionDeclarationSchemaType as schemaType,
	FunctionDeclarationSchema,
	FunctionDeclaration,
	FunctionDeclarationsTool,
	FunctionCallingMode,
	GoogleGenerativeAI,
} from "@google/generative-ai";


const MODEL_NAME = "gemini-1.5-pro-vision-latest";
const API_KEY = process.env.GOOGLE_GEMINI_KEY || "";

export async function POST(request: Request) {
	// Set a default value if the environment variable is undefined
	const API_KEY = process.env.GOOGLE_GEMINI_KEY || "";
	const genAI = new GoogleGenerativeAI(API_KEY);
	const { image } = await request.json();
	const imageMimeType = getMimeType(image) || 'image/jpeg';

	console.log("image mime type: ", getMimeType(image));

	let menuItems: FunctionDeclarationSchema = {
		type: schemaType.OBJECT,
		properties: {
			"itemName": { type: schemaType.STRING },
			"description": { type: schemaType.STRING },
			"price": { type: schemaType.NUMBER },
			"additionalInfo": { type: schemaType.STRING },
		},
		required: ["itemName", "price"],
	};
	let sections: FunctionDeclarationSchema = {
		type: schemaType.OBJECT,
		properties: {
			"sectionTitle": { type: schemaType.STRING },
			"menuItems": { type: schemaType.ARRAY, items: menuItems },
		},
	};
	let menu: FunctionDeclarationSchema = {
		type: schemaType.OBJECT,
		properties: {
			"restaurantType": { type: schemaType.STRING },
			"menuSections": { type: schemaType.ARRAY, items: sections },
		},
	};
	let extractMenu: FunctionDeclaration = {
		name: "extract_menu_items",
		description: "Extract menu items from an image of a food menu.",
		parameters: menu,
	};
	let menuTool: FunctionDeclarationsTool = {
		functionDeclarations: [extractMenu],
	};

	const model = genAI.getGenerativeModel({
		model: "gemini-1.5-pro-latest",
		tools: [menuTool],
	});

	const prompt = {
		role: "user",
		parts: [
			{
				text: "Please extract menu items with additional information where possible from this image in English JSON describing the menu items from a restaurant using the following Schema:"
			},
			{ text: "Image: " },
			{
				inlineData: {
					mimeType: imageMimeType,
					data: image
				}
			},
		],
	};
	try {
		const result = await model.generateContent({
			contents: [prompt],
			// toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.ANY } },
		});
		console.log(result.response);
		const fc = result.response.candidates?.[0]?.content.parts[0]?.functionCall;
		return new Response(JSON.stringify(fc));

	} catch (error: any) {
		console.error('Error handling request:', error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

const signatures: { [key: string]: string } = {
	JVBERi0: 'application/pdf',
	R0lGODlh: 'image/gif',
	iVBORw0KGgo: 'image/png',
	'/9j/': 'image/jpeg',
};

const getMimeType = (base64: string) => {
	for (const sign in signatures) {
		if (base64.startsWith(sign)) {
			return signatures[sign];
		} else {
			return 'image/jpeg';
		}
	}
};