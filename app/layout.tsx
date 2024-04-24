import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopNavBar } from '@/app/components/TopNavBar';
const inter = Inter({ subsets: ["latin"] });

export const config: Metadata = {
	title: "Image to UI",
	description: "Convert images to UI in any language",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<TopNavBar />
				{children}
			</body>
		</html>
	);
}