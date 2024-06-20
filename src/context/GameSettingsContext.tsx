"use client";

import { brands } from "@/database/brands";
import { fetchCollectionSlug, fetchImage } from "@/database/graphql";
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
	playBrands: string[][];
	collectionSlugs: string[];
	collectionImages: string[];
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
	const [playBrands, setPlayBrands] = useState<string[][]>([]);
	const [collectionSlugs, setCollectionSlugs] = useState<string[]>([]);
	const [collectionImages, setCollectionImages] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [segment, setSegment] = useState<string>("LANDING");
	const [score, setScore] = useState<number>(0);

	const loadNewGame = useCallback(async () => {
		const shuffled = brands.sort(() => 0.5 - Math.random());
		const brandNames = shuffled.slice(0, numRounds);
		setPlayBrands(brandNames);

		const brandSlugs = brandNames.map((entry) => entry[0]);
		await Promise.all(
			brandSlugs.map(async (brandSlug) => await fetchCollectionSlug(brandSlug))
		)
			.then(async (result) => {
				console.log(result);
				setCollectionSlugs(result);
				await Promise.all(
					result.map(async (collectionSlug) => await fetchImage(collectionSlug))
				)
					.then((result) => setCollectionImages(result))
					.catch((e) => console.log(e));
			})
			.catch((e) => console.log(e));
	}, [numRounds]);

	useEffect(() => {
		loadNewGame();
	}, [loadNewGame]);

	useEffect(() => {
		if (collectionImages.length !== 0) {
			setLoading(false);
		}
	}, [collectionImages]);

	const providerValue: GameSettingsContextProps = useMemo(
		() => ({
			numRounds: numRounds,
			difficulty: difficulty,
			playBrands: playBrands,
			collectionSlugs: collectionSlugs,
			collectionImages: collectionImages,
			loading: loading,
			segment: segment,
			score: score,
			setLoading: setLoading,
			setSegment: setSegment,
			setScore: setScore,
			loadNewGame: loadNewGame,
		}),
		[
			numRounds,
			difficulty,
			playBrands,
			collectionSlugs,
			collectionImages,
			loading,
			segment,
			score,
			loadNewGame,
		]
	);

	return (
		<GameSettingsContext.Provider value={providerValue}>
			{children}
		</GameSettingsContext.Provider>
	);
}
