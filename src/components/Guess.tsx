"use client";

import { useGameSettings } from "@/context/GameSettingsContext";
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

	const [currentRound, setCurrentRound] = useState<number>(0);
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

	useEffect(() => {
		setTimeRemaining(60);
		const timerInterval = setInterval(() => {
			setTimeRemaining((prevTime) => {
				if (prevTime === 0) {
					clearInterval(timerInterval);
					setReveal(true);
					return 0;
				} else {
					return prevTime - 1;
				}
			});
		}, 1000);
		return () => clearInterval(timerInterval);
	}, [opacity]);

	const currentRoundData = useMemo(() => {
		if (gameSettings.roundData) return gameSettings.roundData[currentRound];
		else return null;
	}, [gameSettings.roundData, currentRound]);

	const handleChange = (event: any) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs((values) => ({ ...values, [name]: value }));
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		console.log(currentRoundData);

		if (!currentRoundData) throw new Error("Round data must be defined.");
		const name = currentRoundData.brand_name;
		const season = currentRoundData.season;
		const year = parseInt(
			currentRoundData.collection_slug.split("-")[1] || "0"
		);

		const timeMultiplier = Math.min(timeRemaining + 5, 60) / 60;

		let newPoints = 0;
		if (inputs.brandGuess == name) {
			newPoints += 60;
		}
		// FIXME: need to add checks in case season is not in 1st position of slug, eg. "berlin-spring..."
		// FIXME: need to add correspondence between guess of "pre-fall" and potential value of "pre"
		if (inputs.seasonGuess == season) {
			newPoints += 10;
		}
		// FIXME: need to add checks in case year is not in 2nd position of slug, eg. "pre-fall-2020..."
		const offset = Math.abs(year - inputs.yearGuess) ** 2;
		newPoints += Math.max(30 - offset, 0);
		gameSettings.setScore(
			gameSettings.score + Math.round(newPoints * timeMultiplier)
		);
		setReveal(true);
	};

	const handleNextImage = () => {
		setOpacity(0);
		setReveal(false);
		if (gameSettings.roundData) {
			if (currentRound + 1 == gameSettings.roundData.length) {
				gameSettings.setSegment("GAME_END");
			} else {
				setCurrentRound(currentRound + 1);
			}
		}
	};

	useEffect(() => {
		setImage(currentRoundData?.url || "");
	}, [currentRoundData]);

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
								style={{ opacity: opacity, objectFit: "cover" }}
								fill={true}
								priority={false}
								onLoad={() => {
									setOpacity(1);
								}}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								placeholder="empty"
								alt={"runway image"}
								src={image}
							/>
							{/* )} */}
						</div>
						<div className="w-full max-w-[80vw] min-w-[20vw] mx-auto flex justify-center space-x-4">
							{reveal ? (
								<div>
									<p>{currentRoundData?.brand_name}</p>
									<p>{currentRoundData?.collection_slug.split("-")[0]}</p>
									<p>{currentRoundData?.collection_slug?.split("-")[1]}</p>
									<button
										onClick={() => handleNextImage()}
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
									>
										{currentRound === gameSettings.numRounds
											? "See Results"
											: "Next Image"}
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
