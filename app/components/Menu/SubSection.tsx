// SubSection.tsx

import React from 'react';


const SubSection = ({ section }) => {
	return (
		<div className="menu-section">
			<h3 className="section-title">{section.sectionTitle}</h3>
			<ul className="menu-items">
				{section.menuItems.map((item, itemIndex) => (
					<li key={itemIndex} className="menu-item">
						<span className="item-name">{item.itemName}</span>
						<span className="item-description">{item.description}</span>
						<span className="item-price">{item.price}</span>
						<span className="item-additionalInfo">{item.additionalInfo}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default SubSection;