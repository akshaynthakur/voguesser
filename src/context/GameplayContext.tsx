"use client";

import { brands } from "@/database/brands";
import { fetchCollectionSlug } from "@/database/graphql";
import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	useMemo,
	useCallback,
} from "react";

interface GameplayContextProps {
	numRounds: number;
	score: number;
	difficulty: number;
	playBrands: string[][];
	collectionSlugs: string[];
	collectionImages: string[];
}

const GameplayContext = createContext<GameplayContextProps | undefined>(
	undefined
);

export const useGameplay = () => useContext(GameplayContext);

export function GameplayProvider({ children }: { children: React.ReactNode }) {
	const [numRounds, setNumRounds] = useState<number>(3);
	const [score, setScore] = useState<number>(0);
	const [difficulty, setDifficulty] = useState<number>(1);
	const [playBrands, setPlayBrands] = useState<string[][]>([[]]);
	const [collectionSlugs, setCollectionSlugs] = useState<string[]>([]);
	const [collectionImages, setCollectionImages] = useState<string[]>([]);

	const loadBrands = () => {
		const shuffled = brands.sort(() => 0.5 - Math.random());
		setPlayBrands(shuffled.slice(0, numRounds));
	};

	const loadCollectionSlugs = async () => {
		if (playBrands[0].length == 0) {
			return;
		}
		console.log(playBrands);
		const brandSlugs = playBrands.map((entry) => entry[0]);
		await Promise.all(
			brandSlugs.map(async (brandSlug) => await fetchCollectionSlug(brandSlug))
		)
			.then((result) => setCollectionSlugs(result))
			.catch((e) => console.log(e));
	};

	useEffect(() => {
		loadBrands();
	}, []);

	useEffect(() => {
		loadCollectionSlugs();
	}, [playBrands]);

	const providerValue: GameplayContextProps = useMemo(
		() => ({
			numRounds: numRounds,
			score: score,
			difficulty: difficulty,
			playBrands: playBrands,
			collectionSlugs: collectionSlugs,
			collectionImages: collectionImages,
		}),
		[
			numRounds,
			score,
			difficulty,
			playBrands,
			collectionSlugs,
			collectionImages,
		]
	);

	return (
		<GameplayContext.Provider value={providerValue}>
			{children}
		</GameplayContext.Provider>
	);
}
