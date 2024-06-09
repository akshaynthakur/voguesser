"use client";

import { brands } from "@/database/brands";
import { fetchCollectionSlug, fetchImage } from "@/database/graphql";
import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	useMemo,
} from "react";

interface GameSettingsContextProps {
	numRounds: number | undefined;
	difficulty: number | undefined;
	playBrands: string[][] | undefined;
	collectionSlugs: string[] | undefined;
	collectionImages: string[] | undefined;
	loading: boolean;
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

	const loadBrands = () => {
		const shuffled = brands.sort(() => 0.5 - Math.random());
		setPlayBrands(shuffled.slice(0, numRounds));
	};

	useEffect(() => {
		if (!numRounds) {
			return;
		}
		const gameSettings = localStorage.getItem("voguesser_gamesettings");
		if (gameSettings && JSON.parse(gameSettings).playBrands) {
			setPlayBrands(JSON.parse(gameSettings).playBrands);
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
		const gameSettings = localStorage.getItem("voguesser_gamesettings");
		if (gameSettings && JSON.parse(gameSettings).collectionSlugs) {
			setCollectionSlugs(JSON.parse(gameSettings).collectionSlugs);
			setLoading(false);
		} else {
			loadCollectionSlugs();
			setLoading(false);
		}
	}, [playBrands]);

	const loadCollectionIamges = async () => {
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
	};

	useEffect(() => {
		const gameSettings = localStorage.getItem("voguesser_gamesettings");
		if (gameSettings && JSON.parse(gameSettings).collectionImages) {
			setCollectionImages(JSON.parse(gameSettings).collectionImages);
		} else {
			setLoading(true);
			loadCollectionIamges();
			setLoading(false);
		}
	}, [collectionSlugs]);

	const providerValue: GameSettingsContextProps = useMemo(
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
			localStorage.setItem(
				"voguesser_gamesettings",
				JSON.stringify(providerValue)
			);
		}
	}, [providerValue]);

	return (
		<GameSettingsContext.Provider value={providerValue}>
			{children}
		</GameSettingsContext.Provider>
	);
}
