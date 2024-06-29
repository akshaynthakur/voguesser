"use client";

import { fetchRunway } from "@/database/queries";
import { GameRound } from "@/types/types";
import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	useMemo,
	useCallback,
	Dispatch,
	SetStateAction,
} from "react";

interface GameSettingsContextProps {
	numRounds: number;
	difficulty: number;
	roundData: GameRound[];
	loading: boolean;
	segment: string;
	score: number;
	setLoading: Dispatch<SetStateAction<boolean>>;
	setSegment: Dispatch<SetStateAction<string>>;
	setScore: Dispatch<SetStateAction<number>>;
	loadNewGame: () => Promise<void>;
}

const GameSettingsContext = createContext<GameSettingsContextProps | undefined>(
	undefined
);

export const useGameSettings = () => useContext(GameSettingsContext);

export function GameSettingsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [numRounds, setNumRounds] = useState<number>(3);
	const [difficulty, setDifficulty] = useState<number>(1);
	const [roundData, setRoundData] = useState<GameRound[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [segment, setSegment] = useState<string>("LANDING");
	const [score, setScore] = useState<number>(0);

	const loadNewGame = useCallback(async () => {
		setScore(0);

		await fetchRunway(numRounds)
			.then((res) => {
				setRoundData(res);
			})
			.catch((e) => {
				console.log(e);
			});
	}, [numRounds]);

	useEffect(() => {
		loadNewGame();
	}, [loadNewGame]);

	useEffect(() => {
		if (roundData.length !== 0) {
			setLoading(false);
		}
	}, [roundData]);

	const providerValue: GameSettingsContextProps = useMemo(
		() => ({
			numRounds: numRounds,
			difficulty: difficulty,
			roundData: roundData,
			loading: loading,
			segment: segment,
			score: score,
			setLoading: setLoading,
			setSegment: setSegment,
			setScore: setScore,
			loadNewGame: loadNewGame,
		}),
		[numRounds, difficulty, loading, roundData, segment, score, loadNewGame]
	);

	return (
		<GameSettingsContext.Provider value={providerValue}>
			{children}
		</GameSettingsContext.Provider>
	);
}
