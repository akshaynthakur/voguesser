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
	numRounds: number | undefined;
	score: number | undefined;
	difficulty: number | undefined;
	playBrands: string[][] | undefined;
	collectionSlugs: string[] | undefined;
	collectionImages: string[] | undefined;
	loading: boolean;
}

const GameplayContext = createContext<GameplayContextProps | undefined>(
	undefined
);

export const useGameplay = () => useContext(GameplayContext);

export function GameplayProvider({ children }: { children: React.ReactNode }) {
	const [numRounds, setNumRounds] = useState<number | undefined>(3);
	const [score, setScore] = useState<number | undefined>(1);
	const [difficulty, setDifficulty] = useState<number | undefined>(0);
	const [playBrands, setPlayBrands] = useState<string[][]>();
	const [collectionSlugs, setCollectionSlugs] = useState<string[]>();
	const [collectionImages, setCollectionImages] = useState<string[]>();
	const [loading, setLoading] = useState<boolean>(true);

	const getGameplay = () => {
		const gameplay = localStorage.getItem("voguesser_gameplay");
		if (gameplay) {
			const parsed: GameplayContextProps = JSON.parse(gameplay);
			setNumRounds(parsed.numRounds);
			setScore(parsed.score);
			setDifficulty(parsed.difficulty);
			setPlayBrands(parsed.playBrands);
			setCollectionSlugs(parsed.collectionSlugs);
			setCollectionImages(parsed.collectionImages);
			setLoading(false);
		} else {
			console.log("about to load brands");
			loadBrands();
			setLoading(false);
		}
	};

	const loadBrands = () => {
		const shuffled = brands.sort(() => 0.5 - Math.random());
		setPlayBrands(shuffled.slice(0, numRounds));
	};

	const loadCollectionSlugs = async () => {
		if (!playBrands) {
			return;
		}
		const brandSlugs = playBrands.map((entry) => entry[0]);
		await Promise.all(
			brandSlugs.map(async (brandSlug) => await fetchCollectionSlug(brandSlug))
		)
			.then((result) => setCollectionSlugs(result))
			.catch((e) => console.log(e));
	};

	const providerValue: GameplayContextProps = useMemo(
		() => ({
			numRounds: numRounds,
			score: score,
			difficulty: difficulty,
			playBrands: playBrands,
			collectionSlugs: collectionSlugs,
			collectionImages: collectionImages,
			loading: loading,
		}),
		[
			numRounds,
			score,
			difficulty,
			playBrands,
			collectionSlugs,
			collectionImages,
			loading,
		]
	);

	useEffect(() => {
		if (providerValue.playBrands) {
			localStorage.setItem("voguesser_gameplay", JSON.stringify(providerValue));
		}
	}, [providerValue]);

	useEffect(() => {
		getGameplay();
	}, []);

	useEffect(() => {
		loadCollectionSlugs();
	}, [playBrands]);

	return (
		<GameplayContext.Provider value={providerValue}>
			{children}
		</GameplayContext.Provider>
	);
}
