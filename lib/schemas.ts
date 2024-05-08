import {
	FunctionDeclarationSchemaType as schemaType,
	FunctionDeclarationSchema,
	FunctionDeclaration,
	FunctionDeclarationsTool,
	FunctionCallingMode,
} from "@google/generative-ai";

export const menuItems: FunctionDeclarationSchema = {
	type: schemaType.OBJECT,
	properties: {
		"itemName": { type: schemaType.STRING },
		"description": { type: schemaType.STRING, description: "brief explanation of the menu item", nullable: true },
		"price": { type: schemaType.NUMBER },
		"additionalInfo": { type: schemaType.STRING, description: "Any additional information about the item (e.g., spicy level, chef's recommendation, allergen information, combo deal, etc.)", nullable: true },
	},
	required: ["itemName", "price"],
};

export const sections: FunctionDeclarationSchema = {
	type: schemaType.OBJECT,
	properties: {
		"sectionTitle": { type: schemaType.STRING },
		"menuItems": { type: schemaType.ARRAY, items: menuItems },
	},
	required: ["sectionTitle", "menuItems"],
};
export const menu: FunctionDeclarationSchema = {
	type: schemaType.OBJECT,
	properties: {
		"restaurantType": { type: schemaType.STRING, description: "The translated name of the restaurant if not found then a guess at the cuisine" },
		"menuSections": { type: schemaType.ARRAY, items: sections, description: "An array of all menu sections contained in the image" },
	},
	required: ["restaurantType", "menuSections"],
};