"use client";

// import { useWebDeviceDetection } from "@/context/WindowWidthContext";
import { useGameSettings } from "@/context/GameSettingsContext";
import { Landing } from "@/components/Landing";
import { Guess } from "@/components/Guess";
import { GameEnd } from "@/components/GameEnd";

export default function Home() {
	// const isWebDevice = useWebDeviceDetection();
	const gameSettings = useGameSettings();
	if (!gameSettings) throw new Error("Game settings must be defined");

	return (
		<body>
			<p className="font-sans w-full px-4 py-10 text-black text-center text-base gap-4">
				VoGuesser
			</p>
			{gameSettings.segment === "LANDING" && <Landing />}
			{gameSettings.segment === "GUESS" && <Guess />}
			{gameSettings.segment === "GAME_END" && <GameEnd />}
		</body>
	);
}
