import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameSettingsProvider } from "@/context/GameSettingsContext";
import { GameStateProvider } from "@/context/GameStateContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "VoGuesser",
	description: "A game to test your runway knowledge.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<GameSettingsProvider>
					<GameStateProvider>{children}</GameStateProvider>
				</GameSettingsProvider>
			</body>
		</html>
	);
}
