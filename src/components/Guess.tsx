"use client";

import { useGameSettings } from "@/context/GameSettingsContext";
import Image from "next/image";
import { relative } from "path";
import { useEffect, useMemo, useState } from "react";

interface GuessInputs {
	brandGuess: string;
	seasonGuess: string;
	yearGuess: number;
}

export const Guess = () => {
	const gameSettings = useGameSettings();
	if (!gameSettings) throw new Error("Game settings must be defined");

	const [currentRound, setCurrentRound] = useState<number>(1);
	const [image, setImage] = useState<string>("");
	// const [loading, setLoading] = useState<boolean>(true);
	const [opacity, setOpacity] = useState(0);
	const [reveal, setReveal] = useState<boolean>(false);
	const [inputs, setInputs] = useState<GuessInputs>({
		brandGuess: "",
		seasonGuess: "",
		yearGuess: 0,
	});

	const slug = useMemo(() => {
		if (gameSettings.collectionSlugs)
			return gameSettings.collectionSlugs[currentRound - 1];
		else "";
	}, [currentRound, gameSettings.collectionSlugs]);

	const brandName = useMemo(() => {
		if (gameSettings.playBrands)
			return gameSettings.playBrands[currentRound - 1][1];
		else "";
	}, [currentRound, gameSettings.playBrands]);

	const handleChange = (event: any) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs((values) => ({ ...values, [name]: value }));
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		let newPoints = 0;
		if (inputs.brandGuess == brandName) {
			newPoints += 60;
		}
		if (inputs.seasonGuess == slug?.split("-")[0]) {
			newPoints += 10;
		}
		if (inputs.yearGuess.toString() == slug?.split("-")[1]) {
			newPoints += 30;
		}
		gameSettings.setScore(gameSettings.score + newPoints);
		setReveal(true);
	};

	const handleNextImage = () => {
		setOpacity(0);
		setReveal(false);
		if (gameSettings.collectionImages) {
			if (currentRound == gameSettings.numRounds) {
				gameSettings.setSegment("GAME_END");
			} else {
				setCurrentRound(currentRound + 1);
			}
		}
	};

	useEffect(() => {
		setImage(gameSettings.collectionImages[currentRound - 1]);
	}, [currentRound, gameSettings.collectionImages]);

	return (
		<section className="flex justify-center">
			{gameSettings.loading ? (
				<p>Loading...</p>
			) : (
				<div>
					<p>Score: {gameSettings.score}</p>
					<div className="flex justify-center">
						<div
							style={{
								width: "26.67vw",
								height: "40vw",
								position: "relative",
								overflow: "hidden",
							}}
						>
							{/* {loading ? (
								<p>Loading...</p>
							) : ( */}
							<Image
								style={{ opacity: opacity }}
								fill={true}
								priority={true}
								onLoad={() => {
									setOpacity(1);
								}}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								placeholder="empty"
								alt={"runway image"}
								src={image}
								objectFit="cover"
							/>
							{/* )} */}
						</div>
						<div className="flex items-center justify-center bg-gray-100">
							{reveal ? (
								<div className="w-96">
									<p>{brandName}</p>
									<p>{slug?.split("-")[0]}</p>
									<p>{slug?.split("-")[1]}</p>
									<button
										onClick={() => handleNextImage()}
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
					</div>
				</div>
			)}
		</section>
	);
};
