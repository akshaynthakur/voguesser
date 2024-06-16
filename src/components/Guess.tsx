"use client";

import { useGameSettings } from "@/context/GameSettingsContext";
import { useGameState } from "@/context/GameStateContext";
import Image from "next/image";
import { useMemo, useState } from "react";

interface GuessInputs {
	brandGuess: string;
	seasonGuess: string;
	yearGuess: number;
}

export const Guess = () => {
	const gameSettings = useGameSettings();
	if (!gameSettings) throw new Error("Game settings must be defined");

	const gameState = useGameState();
	if (!gameState) throw new Error("Game state must be defined");

	const image = useMemo(() => {
		return gameState.image ? gameState.image : "";
	}, [gameState.image]);

	const slug = useMemo(() => {
		if (gameSettings.collectionSlugs && gameState.currentRound)
			return gameSettings.collectionSlugs[gameState.currentRound - 1];
		else "";
	}, [gameSettings.collectionSlugs, gameState.currentRound]);

	const [reveal, setReveal] = useState<boolean>(false);

	const [inputs, setInputs] = useState<GuessInputs>({
		brandGuess: "",
		seasonGuess: "",
		yearGuess: 0,
	});

	const handleChange = (event: any) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs((values) => ({ ...values, [name]: value }));
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		setReveal(true);
	};

	const handleReveal = () => {
		setReveal(false);
		if (gameState.currentRound && gameSettings.collectionImages) {
			if (gameState.currentRound == gameSettings.numRounds) {
				gameState.setSegment("GAME_END");
			} else {
				gameState.setImage(
					gameSettings.collectionImages[gameState.currentRound]
				);
				gameState.setCurrentRound(gameState.currentRound + 1);
			}
		}
	};

	return (
		<section className="flex justify-center">
			<Image width={200} height={300} alt={"runway image"} src={image}></Image>
			<div className="flex items-center justify-center bg-gray-100">
				{reveal ? (
					<div className="w-96">
						<p>{slug?.split("/")[1]}</p>
						<p>{slug?.split("-")[0]}</p>
						<p>{slug?.split("-")[1]}</p>
						<button
							onClick={() => handleReveal()}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
						>
							Next Image
						</button>
					</div>
				) : (
					<form
						className="flex flex-col items-start bg-grey p-6 rounded shadow-lg w-96"
						onSubmit={handleSubmit}
					>
						<label>
							Brand:
							<input
								className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								type="text"
								name="brandGuess"
								value={inputs.brandGuess}
								onChange={handleChange}
							/>
						</label>
						<label>
							Season:
							<input
								className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								type="text"
								name="seasonGuess"
								value={inputs.seasonGuess}
								onChange={handleChange}
							/>
						</label>
						<label>
							Year:
							<input
								className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								type="number"
								name="yearGuess"
								value={inputs.yearGuess}
								onChange={handleChange}
							/>
						</label>
						<input
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
							type="submit"
						/>
					</form>
				)}
			</div>
		</section>
	);
};
