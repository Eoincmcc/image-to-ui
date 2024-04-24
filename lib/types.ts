// types.ts

export interface MenuItem {
	itemName: string;
	description: string;
	price: number;
	additionalInfo: string;
}

export interface MenuSection {
	sectionTitle: string;
	menuItems: MenuItem[];
}

export interface RestaurantData {
	restaurantType: string;
	menuSections: MenuSection[];
}
