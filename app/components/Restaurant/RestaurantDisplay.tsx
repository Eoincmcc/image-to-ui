// RestaurantDisplay.tsx
import React from "react";
import { RestaurantData } from "@/lib/types";
import MenuCard from "../Menu/menuCard";
import { FlexboxSpacer } from "@/app/components/FlexboxSpacer";
import { cx } from "@/lib/cx";

export const RestaurantDisplay = (restaurantData: RestaurantData) => {
	console.log(restaurantData);
	const [isHover, setIsHover] = React.useState(false);
	return (
		<div className={cx(
			"flex justify-center scrollbar scrollbar-track-gray-100 scrollbar-w-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll",
			isHover && "scrollbar-thumb-gray-200"
		)}>
			{restaurantData.menuSections.length > 0 ? (
				<MenuCard menuSections={restaurantData.menuSections} restaurantType={restaurantData.restaurantType} />
			) : (
				<p>No menu data to display.</p>
			)}
			<FlexboxSpacer maxWidth={50} className="hidden md:block" />
		</div>
	);
}
