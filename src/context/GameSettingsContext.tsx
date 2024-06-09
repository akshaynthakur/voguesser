"use client";

import { brands } from "@/database/brands";
import { fetchCollectionSlug } from "@/database/graphql";
import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	useMemo,
} from "react";

interface GameplayContextProps {
	numRounds: number | undefined;
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
	const [numRounds, setNumRounds] = useState<number>();
	const [difficulty, setDifficulty] = useState<number>();
	const [playBrands, setPlayBrands] = useState<string[][]>();
	const [collectionSlugs, setCollectionSlugs] = useState<string[]>();
	const [collectionImages, setCollectionImages] = useState<string[]>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const gameplay = localStorage.getItem("voguesser_gameplay");
		if (gameplay && JSON.parse(gameplay).numRounds) {
			setNumRounds(JSON.parse(gameplay).numRounds);
		} else {
			setNumRounds(3);
		}
		if (gameplay && JSON.parse(gameplay).difficulty) {
			setDifficulty(JSON.parse(gameplay).difficulty);
		} else {
			setDifficulty(1);
		}
	}, []);

	const loadBrands = () => {
		const shuffled = brands.sort(() => 0.5 - Math.random());
		setPlayBrands(shuffled.slice(0, numRounds));
	};

	useEffect(() => {
		if (!numRounds) {
			return;
		}
		const gameplay = localStorage.getItem("voguesser_gameplay");
		if (gameplay && JSON.parse(gameplay).playBrands) {
			setPlayBrands(JSON.parse(gameplay).playBrands);
		} else {
			loadBrands();
		}
	}, [numRounds]);

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

	useEffect(() => {
		const gameplay = localStorage.getItem("voguesser_gameplay");
		if (gameplay && JSON.parse(gameplay).collectionSlugs) {
			setCollectionSlugs(JSON.parse(gameplay).collectionSlugs);
			setLoading(false);
		} else {
			// } else if (gameplay) {
			loadCollectionSlugs();
			setLoading(false);
		}
	}, [playBrands]);

	const providerValue: GameplayContextProps = useMemo(
		() => ({
			numRounds: numRounds,
			difficulty: difficulty,
			playBrands: playBrands,
			collectionSlugs: collectionSlugs,
			collectionImages: collectionImages,
			loading: loading,
		}),
		[
			numRounds,
			difficulty,
			playBrands,
			collectionSlugs,
			collectionImages,
			loading,
		]
	);

	useEffect(() => {
		if (playBrands) {
			localStorage.setItem("voguesser_gameplay", JSON.stringify(providerValue));
		}
	}, [providerValue]);

	return (
		<GameplayContext.Provider value={providerValue}>
			{children}
		</GameplayContext.Provider>
	);
}
