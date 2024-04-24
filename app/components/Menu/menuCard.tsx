// menuCard.tsx

import React from "react";
import { RestaurantData } from "@/lib/types";

const MenuCard: React.FC<RestaurantData> = ({ menuSections }) => {
	return (
		<div className="menu-container">
			{menuSections.map((section, index) => (
				<section
					className="flex flex-col gap-3 rounded-md bg-white p-6 pt-4 shadow transition-opacity duration-200"
				>
					<div key={index} className="menu-section flex flex-col gap-6">
						<h2 className="section-title text-lg font-semibold tracking-wide text-gray-900 ">{section.sectionTitle}</h2>
						{section.menuItems.map((item, itemIndex) => (
							<div className="px-2" key={itemIndex}>
								<div className="relative w-96 self-center pl-16">
									<dt className="font-bold">
										{/* <Image
											src={src}
											className="absolute left-0 top-1 h-12 w-12"
											alt="Feature icon"
										/> */}
										{item.itemName}
									</dt>
									<dd className="mt-2">{item.description}</dd>
									<dd className="mt-2">{item.price}</dd>
									<dd className="mt-2">{item.additionalInfo}</dd>
								</div>
							</div>
						))}
					</div>
				</section >
			))}
		</div >
	);
};
export default MenuCard;
