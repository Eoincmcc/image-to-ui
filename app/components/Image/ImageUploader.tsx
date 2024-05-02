// ImageUploader.tsx
import { ChangeEvent, useState, FormEvent } from "react";
import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
	onImageUpload: (menuImage: string) => void;
}

export const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
	const [image, setImage] = useState<string>("");
	const [baseFile, setFile] = useState<string>("");

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files === null) {
			window.alert("No file selected. Choose a file.");
			return;
		}
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = () => {
			if (typeof reader.result === "string") {
				setImage(reader.result);
				setFile((reader.result as string).split(',')[1]);
			}
		};
		reader.onerror = (error) => {
			console.error("error: ", error);
		};
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log("Submit called");

		if (!image) {
			alert("Please select an image to upload.");
			return;
		}
		onImageUpload(baseFile);
	}

	return (
		<div className="flex max-w-2xl flex-col gap-8 p-4">
			<div className="flex flex-col gap-3 rounded-md bg-white p-6 pt-4 shadow transition-opacity duration-200 undefined">
				<h2 className="block w-full border-b border-transparent text-lg font-semibold tracking-wide text-gray-900 outline-none hover:border-gray-300 hover:shadow-sm">Uploaded Image</h2>
				{image !== "" ? (
					<div className="mb-4 overflow-hidden">
						<img src={image} className="w-full object-contain max-h-72" />
					</div>
				) : (
					<div className="mb-4 p-8 text-center text-gray-900">
						<p>Once you upload an image, you will see it here.</p>
					</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className='flex flex-col mb-6'>
						<label className="mb-2 text-sm font-medium text-gray-900">Upload Image</label>
						<input
							type="file"
							className="text-sm border rounded-lg cursor-pointer p-2 bg-gray-50 text-gray-900 hover:bg-gray-100"
							onChange={handleFileChange}
						/>
					</div>
					<div className='flex justify-center'>
						<button type="submit" className="flex items-center rounded-md bg-white py-2 pl-3 pr-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
							<PlusCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
							Generate Food Menu
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
