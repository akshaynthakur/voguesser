"use client";

// import { useWebDeviceDetection } from "@/context/WindowWidthContext";
import { useRouter } from "next/navigation";
import { fetchCollectionSlug, fetchImage } from "@/database/graphql";
import { useContext, useEffect, useMemo, useState } from "react";
import { useGameSettings } from "@/context/GameSettingsContext";
import Image from "next/image";
import { Landing } from "@/components/Landing";
import { useGameState } from "@/context/GameStateContext";
import { Guess } from "@/components/Guess";

export default function Home() {
	// const isWebDevice = useWebDeviceDetection();
	const gameSettings = useGameSettings();
	if (!gameSettings) throw new Error("Game settings must be defined");

	const gameState = useGameState();
	if (!gameState) throw new Error("Game state must be defined");

	return (
		<body>
			<p className="font-sans w-full px-4 py-10 text-black text-center text-base gap-4">
				VoGuesser
			</p>
			{gameState.segment === "LANDING" && <Landing />}
			{gameState.segment === "GUESS" && <Guess />}
		</body>
	);
}
