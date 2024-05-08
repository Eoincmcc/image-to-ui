"use client";
import { ImageUploader } from "@/app/components/Image/ImageUploader";
import { RestaurantDisplay } from "@/app/components/Restaurant/RestaurantDisplay";
import { useState } from "react";
import { RestaurantData } from "@/lib/types";

export const ImageConverter = () => {
	const [menu, setMenu] = useState<RestaurantData | null>(null);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleImageUpload(menuImage: string) {
		console.log("Image uploaded");
		setLoading(true);
		setError(null);
		try {
			if (process.env.USE_LOCAL_DATA) {
				const localDataResponse = await fetch("api/localData");
				if (localDataResponse.ok) {
					const localData = await localDataResponse.json();
					if (localData.data !== null) {
						console.log("Using local data", localData.input_schema.properties);
						setMenu(localData.input_schema.properties);
						setLoading(false);
						console.log("Local data loaded");
					}
				}
			} else {
				const response = await fetch("api/geminiAnalyze", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ image: menuImage })
				});
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();
				console.log("Received data from API", JSON.stringify(data));
				setMenu(data);
			}
		} catch (err) {
			console.error("Failed to fetch: ", err);
			setError("Failed to load the data");
		}
		setLoading(false);
	}

	return (
		<main className="relative h-full w-full overflow-hidden bg-gray-50">
			<div className="grid grid-cols-3 md:grid-cols-6">
				<div className="col-span-3">
					<ImageUploader onImageUpload={handleImageUpload} />
				</div>
				<div className="col-span-3">
					{isLoading ? (
						<p>Loading...</p>
					) : menu ? (
						<div className="col-span-3">
							<RestaurantDisplay {...menu} />
						</div>
					) : null}
				</div>
			</div>
		</main>
	);
}