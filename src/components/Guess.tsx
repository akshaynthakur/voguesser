"use client";

import { useGameSettings } from "@/context/GameSettingsContext";
import { truncateSync } from "fs";
import Image from "next/image";
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
	const [opacity, setOpacity] = useState(0);
	const [reveal, setReveal] = useState<boolean>(false);
	const [inputs, setInputs] = useState<GuessInputs>({
		brandGuess: "",
		seasonGuess: "",
		yearGuess: 0,
	});

	const initialTime = 60;
	const [timeRemaining, setTimeRemaining] = useState(initialTime);
	// const [timerRunning, setTimerRunning] = useState(true);

	useEffect(() => {
		setTimeRemaining(60);
		const timerInterval = setInterval(() => {
			setTimeRemaining((prevTime) => {
				if (prevTime === 0) {
					clearInterval(timerInterval);
					console.log("Countdown complete!");
					return 0;
					// } else if (timerRunning) {
					// 	return prevTime - 1;
				} else {
					return prevTime - 1;
				}
			});
		}, 1000);
		return () => clearInterval(timerInterval);
	}, [opacity]);

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
		const timeMultiplier = Math.min(timeRemaining + 5, 60) / 60;
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
		gameSettings.setScore(
			gameSettings.score + Math.round(newPoints * timeMultiplier)
		);
		console.log(newPoints);
		console.log(timeMultiplier);
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
					<div className="flex justify-between">
						<p>Score: {gameSettings.score}</p>
						{!reveal && <p>Seconds: {timeRemaining}</p>}
					</div>
					<div className="flex justify-center">
						<div
							style={{
								width: "26.67vw",
								height: "40vw",
								position: "relative",
								overflow: "hidden",
							}}
						>
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
						<div className="w-full max-w-[80vw] min-w-[20vw] mx-auto flex justify-center space-x-4">
							{reveal ? (
								<div>
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
									className="flex flex-col items-start bg-grey rounded shadow-lg"
									onSubmit={handleSubmit}
								>
									<label className="text-[2.5vw]">
										Brand:
										<input
											className="text-[2.5vw] border border-gray-300 w-[40vw] p-[2vw] m-[0.5em] rounded focus:outline-none focus:ring-[0.25vw] focus:ring-blue-500 focus:border-transparent"
											type="text"
											name="brandGuess"
											value={inputs.brandGuess}
											onChange={handleChange}
										/>
									</label>
									<label className="text-[2.5vw]">
										Season:
										<input
											className="text-[2.5vw] border border-gray-300 w-[40vw] p-[2vw] m-[0.5em] rounded focus:outline-none focus:ring-[0.25vw] focus:ring-blue-500 focus:border-transparent"
											type="text"
											name="seasonGuess"
											value={inputs.seasonGuess}
											onChange={handleChange}
										/>
									</label>
									<label className="text-[2.5vw]">
										Year:
										<input
											className="text-[2.5vw] border border-gray-300 w-[40vw] p-[2vw] m-[0.5em] rounded focus:outline-none focus:ring-[0.25vw] focus:ring-blue-500 focus:border-transparent"
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
