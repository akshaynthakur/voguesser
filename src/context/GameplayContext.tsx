"use client";

import { brands } from "@/database/brands";
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
	brands: string[][];
	collectionImages: string[];
}

const GameplayContext = createContext<GameplayContextProps | undefined>(
	undefined
);

export function GameplayProvider({ children }: { children: React.ReactNode }) {
	const [numRounds, setNumRounds] = useState<number>(10);
	const [score, setScore] = useState<number>(0);
	const [difficulty, setDifficulty] = useState<number>(1);
	const [playBrands, setPlayBrands] = useState<string[][]>([[]]);
	const [collectionSlugs, setCollectionSlugs] = useState<string[]>([]);
	const [collectionImages, setCollectionImages] = useState<string[]>([]);

	const loadBrands = useCallback(() => {
		const shuffled = brands.sort(() => 0.5 - Math.random());
		setPlayBrands(shuffled.slice(0, numRounds));
	}, [numRounds]);

	const loadCollectionSlugs = useCallback(() => {}, []);

	// return <GameplayContext.Provider value={}>{children}</GameplayContext.Provider>;
}
