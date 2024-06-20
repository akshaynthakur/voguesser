"use client";

import { useGameSettings } from "@/context/GameSettingsContext";

export const Landing = () => {
	const gameSettings = useGameSettings();
	if (!gameSettings) throw new Error("Game state must be defined");

	return (
		<section>
			<div className="flex justify-center">
				<div className="flex-col justify-center">
					<h3 className="max-w-sm">
						Think you know fashion? Guess and find out...
					</h3>
					<div className="flex justify-center space-x-4 w-full">
						<button
							onClick={() => {}}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							?
						</button>
						<button
							onClick={() => {
								gameSettings.setSegment("GUESS");
							}}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Play
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};
