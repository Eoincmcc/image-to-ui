import {
	FunctionDeclarationSchemaType as schemaType,
	FunctionDeclarationSchema,
	FunctionDeclaration,
	FunctionDeclarationsTool,
	FunctionCallingMode,
	GoogleGenerativeAI,
} from "@google/generative-ai";
import dedent from "dedent";
import { menu } from "@/lib/schemas";


const MODEL_NAME = "gemini-1.5-pro-vision-latest";
const API_KEY = process.env.GOOGLE_GEMINI_KEY || "";

export async function POST(request: Request) {
	const genAI = new GoogleGenerativeAI(API_KEY);
	const { image } = await request.json();
	const imageMimeType = getMimeType(image);

	let extractMenu: FunctionDeclaration = {
		name: "extract_menu_items",
		description: "Translate menu items from an image of a food menu.",
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
			{ text: "Image: " },
			{
				inlineData: {
					mimeType: imageMimeType,
					data: image
				}
			},
			{
				text: "Translate the menu in the image from Japanese into English following the JSON schema."
			},
		],
	};
	const system = {
		role: "system",
		parts: [
			{
				text: dedent`
				You are a Japanese restaurant owner who wants to digitize their entire menu into English. 
				It should be organised sensibly closely aligning the schema tool as much as possible. 
				You have an image of a menu and want to convert it to json following the schema tool.
				`
			}
		]
	};
	try {
		const result = await model.generateContent({
			contents: [prompt],
			// toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.ANY } },
			systemInstruction: system,
		});

		const fc = result.response.candidates?.[0]?.content.parts[0]?.functionCall?.args;
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
		}
	}
	return 'image/jpeg';
};