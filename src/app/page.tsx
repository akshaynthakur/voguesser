"use client";

// import { useWebDeviceDetection } from "@/context/WindowWidthContext";
import { useRouter } from "next/navigation";
import { fetchCollectionSlug, fetchImage } from "@/database/graphql";
import { useContext, useEffect, useMemo, useState } from "react";
import { useGameplay } from "@/context/GameSettingsContext";

export default function Home() {
	// const isWebDevice = useWebDeviceDetection();
	const gameplay = useGameplay();
	const router = useRouter();

	const playBrands = useMemo(() => {
		if (gameplay?.playBrands) return gameplay.playBrands[0];
		return ["no brands"];
	}, [gameplay]);

	const collectionSlugs = useMemo(() => {
		if (gameplay?.collectionSlugs) return gameplay.collectionSlugs[0];
		return ["no collections"];
	}, [gameplay]);

	return (
		<body>
			<p className="font-sans w-full px-4 py-10 text-black text-center text-base gap-4">
				VoGuesser
			</p>
			<div className="flex justify-center">
				{gameplay?.loading ? (
					<p>Loading...</p>
				) : (
					<div className="flex justify-center">
						<p>{playBrands}</p>
						<p>{collectionSlugs}</p>
						<button
							onClick={() => router.push("/guess")}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Play
						</button>
					</div>
				)}
			</div>
		</body>
	);
}
