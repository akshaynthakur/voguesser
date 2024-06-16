"use client";

import { useGameSettings } from "@/context/GameSettingsContext";
import { useGameState } from "@/context/GameStateContext";
import { useMemo } from "react";

export const GameEnd = () => {
	const gameSettings = useGameSettings();
	if (!gameSettings) throw new Error("Game settings must be defined");

	const gameState = useGameState();
	if (!gameState) throw new Error("Game state must be defined");

	async function sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const handlePlayAgain = async () => {
		gameSettings.setPlayBrands(undefined);
		gameSettings.setCollectionSlugs(undefined);
		gameSettings.setCollectionImages(undefined);
		await sleep(2000);
		gameSettings.setReset(!gameSettings.reset);
		// localStorage.removeItem("voguesser_gamesettings");
	};

	return (
		<section>
			<div className="flex justify-center space-x-4 w-full">
				<p>Final Score: {gameState.score}</p>
				<button
					onClick={() => handlePlayAgain()}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Play Again
				</button>
			</div>
		</section>
	);
};
