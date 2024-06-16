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
	numRounds: number | undefined;
	difficulty: number | undefined;
	playBrands: string[][] | undefined;
	collectionSlugs: string[] | undefined;
	collectionImages: string[] | undefined;
	loading: boolean;
	reset: boolean;
	setReset: Dispatch<SetStateAction<boolean>>;
	loadBrands: () => void;
	setPlayBrands: Dispatch<SetStateAction<string[][] | undefined>>;
	setCollectionSlugs: Dispatch<SetStateAction<string[] | undefined>>;
	setCollectionImages: Dispatch<SetStateAction<string[] | undefined>>;
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
	const [numRounds, setNumRounds] = useState<number>();
	const [difficulty, setDifficulty] = useState<number>();
	const [playBrands, setPlayBrands] = useState<string[][]>();
	const [collectionSlugs, setCollectionSlugs] = useState<string[]>();
	const [collectionImages, setCollectionImages] = useState<string[]>();
	const [loading, setLoading] = useState<boolean>(true);
	const [reset, setReset] = useState<boolean>(false);

	useEffect(() => {
		const gameSettings = localStorage.getItem("voguesser_gamesettings");
		if (gameSettings && JSON.parse(gameSettings).numRounds) {
			setNumRounds(JSON.parse(gameSettings).numRounds);
		} else {
			setNumRounds(3);
		}
		if (gameSettings && JSON.parse(gameSettings).difficulty) {
			setDifficulty(JSON.parse(gameSettings).difficulty);
		} else {
			setDifficulty(1);
		}
	}, []);

	const loadBrands = useCallback(() => {
		const shuffled = brands.sort(() => 0.5 - Math.random());
		setPlayBrands(shuffled.slice(0, numRounds));
	}, [numRounds]);

	useEffect(() => {
		if (!numRounds) {
			return;
		}
		const gameSettings = localStorage.getItem("voguesser_gamesettings");
		if (gameSettings && JSON.parse(gameSettings).playBrands) {
			console.log(JSON.parse(gameSettings).playBrands);
			setPlayBrands(JSON.parse(gameSettings).playBrands);
		} else {
			loadBrands();
		}
	}, [loadBrands, numRounds, reset]);

	const loadCollectionSlugs = useCallback(async () => {
		if (!playBrands) {
			return;
		}
		const brandSlugs = playBrands.map((entry) => entry[0]);
		await Promise.all(
			brandSlugs.map(async (brandSlug) => await fetchCollectionSlug(brandSlug))
		)
			.then((result) => setCollectionSlugs(result))
			.catch((e) => console.log(e));
	}, [playBrands]);

	useEffect(() => {
		const gameSettings = localStorage.getItem("voguesser_gamesettings");
		if (gameSettings && JSON.parse(gameSettings).collectionSlugs) {
			setCollectionSlugs(JSON.parse(gameSettings).collectionSlugs);
			setLoading(false);
		} else {
			loadCollectionSlugs();
			setLoading(false);
		}
	}, [loadCollectionSlugs, playBrands]);

	const loadCollectionImages = useCallback(async () => {
		if (!collectionSlugs) {
			return;
		}
		await Promise.all(
			collectionSlugs.map(
				async (collectionSlug) => await fetchImage(collectionSlug)
			)
		)
			.then((result) => setCollectionImages(result))
			.catch((e) => console.log(e));
	}, [collectionSlugs]);

	useEffect(() => {
		const gameSettings = localStorage.getItem("voguesser_gamesettings");
		if (gameSettings && JSON.parse(gameSettings).collectionImages) {
			setCollectionImages(JSON.parse(gameSettings).collectionImages);
		} else {
			setLoading(true);
			loadCollectionImages();
			setLoading(false);
		}
	}, [loadCollectionImages, collectionSlugs]);

	const providerValue: GameSettingsContextProps = useMemo(
		() => ({
			numRounds: numRounds,
			difficulty: difficulty,
			playBrands: playBrands,
			collectionSlugs: collectionSlugs,
			collectionImages: collectionImages,
			loading: loading,
			reset: reset,
			setReset: setReset,
			loadBrands: loadBrands,
			setPlayBrands: setPlayBrands,
			setCollectionSlugs: setCollectionSlugs,
			setCollectionImages: setCollectionImages,
		}),
		[
			numRounds,
			difficulty,
			playBrands,
			collectionSlugs,
			collectionImages,
			loading,
			reset,
			setReset,
			loadBrands,
			setCollectionImages,
			setCollectionSlugs,
			setPlayBrands,
		]
	);

	useEffect(() => {
		if (providerValue.numRounds) {
			localStorage.setItem(
				"voguesser_gamesettings",
				JSON.stringify(providerValue)
			);
			// console.log(providerValue);
		}
	}, [providerValue]);

	return (
		<GameSettingsContext.Provider value={providerValue}>
			{children}
		</GameSettingsContext.Provider>
	);
}
