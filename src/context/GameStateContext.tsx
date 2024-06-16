"use client";

import {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useGameSettings } from "./GameSettingsContext";

interface GameStateContextProps {
	segment: string | undefined;
	score: number | undefined;
	currentRound: number | undefined;
	image: string | undefined;
	setSegment: Dispatch<SetStateAction<string | undefined>>;
	setScore: Dispatch<SetStateAction<number | undefined>>;
	setCurrentRound: Dispatch<SetStateAction<number | undefined>>;
	setImage: Dispatch<SetStateAction<string | undefined>>;
	// playAgain: () => void;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(
	undefined
);

export const useGameState = () => useContext(GameStateContext);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
	const [segment, setSegment] = useState<string>();
	const [score, setScore] = useState<number>();
	const [currentRound, setCurrentRound] = useState<number>();
	const [image, setImage] = useState<string>();
	const gameSettings = useGameSettings();

	useEffect(() => {
		const gameState = localStorage.getItem("voguesser_gamestate");
		if (gameState && JSON.parse(gameState).segment) {
			setSegment(JSON.parse(gameState).segment);
		} else {
			setSegment("LANDING");
		}
		if (gameState && JSON.parse(gameState).difficulty) {
			setScore(JSON.parse(gameState).score);
		} else {
			setScore(0);
		}
		if (gameState && JSON.parse(gameState).currentRound) {
			setCurrentRound(JSON.parse(gameState).currentRound);
		} else {
			setCurrentRound(1);
		}
	}, [gameSettings]);

	useEffect(() => {
		const gameState = localStorage.getItem("voguesser_gamestate");
		if (gameState && JSON.parse(gameState).image) {
			setImage(JSON.parse(gameState).image);
		} else if (gameSettings?.collectionImages) {
			setImage(gameSettings.collectionImages[0]);
		}
	}, [gameSettings]);

	const playAgain = () => {};

	const providerValue: GameStateContextProps = useMemo(
		() => ({
			segment: segment,
			score: score,
			currentRound: currentRound,
			image: image,
			setSegment: setSegment,
			setScore: setScore,
			setCurrentRound: setCurrentRound,
			setImage: setImage,
			// playAgain: playAgain,
		}),
		[segment, score, currentRound, image]
	);

	useEffect(() => {
		if (providerValue.segment) {
			localStorage.setItem(
				"voguesser_gamestate",
				JSON.stringify(providerValue)
			);
		}
	}, [providerValue]);

	return (
		<GameStateContext.Provider value={providerValue}>
			{children}
		</GameStateContext.Provider>
	);
}
