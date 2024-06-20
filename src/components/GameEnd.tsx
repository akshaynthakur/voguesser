"use client";

import { useGameSettings } from "@/context/GameSettingsContext";
import { useMemo } from "react";

export const GameEnd = () => {
	const gameSettings = useGameSettings();
	if (!gameSettings) throw new Error("Game settings must be defined");

	const handlePlayAgain = async () => {
		gameSettings.setLoading(true);
		gameSettings.setSegment("GUESS");
		gameSettings.loadNewGame();
	};

	return (
		<section>
			<div className="flex justify-center space-x-4 w-full">
				<p>Final Score: {gameSettings.score}</p>
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
