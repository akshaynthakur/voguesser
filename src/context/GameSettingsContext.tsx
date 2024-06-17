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
	setLoading: Dispatch<SetStateAction<boolean>>;
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

	const loadNewGame = useCallback(async () => {
		const shuffled = brands.sort(() => 0.5 - Math.random());
		const brandNames = shuffled.slice(0, numRounds);
		setPlayBrands(brandNames);

		const brandSlugs = brandNames.map((entry) => entry[0]);
		await Promise.all(
			brandSlugs.map(async (brandSlug) => await fetchCollectionSlug(brandSlug))
		)
			.then(async (result) => {
				setCollectionSlugs(result);
				await Promise.all(
					result.map(async (collectionSlug) => await fetchImage(collectionSlug))
				)
					.then((result) => setCollectionImages(result))
					.catch((e) => console.log(e));
			})
			.catch((e) => console.log(e))
			.finally(() => {
				setLoading(false);
			});
	}, [numRounds]);

	useEffect(() => {
		loadNewGame();
	}, [loadNewGame]);

	const providerValue: GameSettingsContextProps = useMemo(
		() => ({
			numRounds: numRounds,
			difficulty: difficulty,
			playBrands: playBrands,
			collectionSlugs: collectionSlugs,
			collectionImages: collectionImages,
			loading: loading,
			setLoading: setLoading,
			loadNewGame: loadNewGame,
		}),
		[
			numRounds,
			difficulty,
			playBrands,
			collectionSlugs,
			collectionImages,
			loading,
			setLoading,
			loadNewGame,
		]
	);

	return (
		<GameSettingsContext.Provider value={providerValue}>
			{children}
		</GameSettingsContext.Provider>
	);
}
