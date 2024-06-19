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
	segment: string;
	score: number;
	currentRound: number;
	image: string;
	setSegment: Dispatch<SetStateAction<string>>;
	setScore: Dispatch<SetStateAction<number>>;
	setCurrentRound: Dispatch<SetStateAction<number>>;
	setImage: Dispatch<SetStateAction<string>>;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(
	undefined
);

export const useGameState = () => useContext(GameStateContext);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
	const [segment, setSegment] = useState<string>("LANDING");
	const [score, setScore] = useState<number>(0);
	const [currentRound, setCurrentRound] = useState<number>(1);
	const [image, setImage] = useState<string>("");
	const gameSettings = useGameSettings();

	useEffect(() => {
		if (gameSettings?.collectionImages) {
			setImage(gameSettings.collectionImages[0]);
		}
	}, [gameSettings]);

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
		}),
		[segment, score, currentRound, image]
	);

	return (
		<GameStateContext.Provider value={providerValue}>
			{children}
		</GameStateContext.Provider>
	);
}
