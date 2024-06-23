"use client";

import { useGameSettings } from "@/context/GameSettingsContext";
import { useMemo } from "react";
import Image from "next/image";

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
			<div className="flex-col justify-center space-x-4 w-full px-16">
				<p>Final Score: {gameSettings.score}</p>
				<div className="max-w-full mx-auto flex justify-center space-x-4">
					{gameSettings.collectionImages.map((url, key) => {
						return (
							<div
								key={key}
								style={{
									width: "26.67vw",
									height: "40vw",
									position: "relative",
									overflow: "hidden",
								}}
							>
								<Image
									style={{ objectFit: "cover" }}
									key={key}
									fill={true}
									priority={true}
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									placeholder="empty"
									alt={"runway image"}
									src={url}
								></Image>
							</div>
						);
					})}
				</div>
				<button
					onClick={() => handlePlayAgain()}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded"
				>
					Play Again
				</button>
			</div>
		</section>
	);
};
