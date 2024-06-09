"use client";

// import { useWebDeviceDetection } from "@/context/WindowWidthContext";
import { useRouter } from "next/navigation";
import { fetchCollectionSlug, fetchImage } from "@/database/graphql";
import { useContext, useEffect, useMemo, useState } from "react";
import { useGameSettings } from "@/context/GameSettingsContext";
import Image from "next/image";

export default function Home() {
	// const isWebDevice = useWebDeviceDetection();
	const gameSettings = useGameSettings();
	const router = useRouter();

	const playBrands = useMemo(() => {
		if (gameSettings?.playBrands) return gameSettings.playBrands[0];
		return ["no brands"];
	}, [gameSettings]);

	const collectionSlugs = useMemo(() => {
		if (gameSettings?.collectionSlugs) return gameSettings.collectionSlugs[0];
		return ["no collections"];
	}, [gameSettings]);

	const collectionImages: string = useMemo(() => {
		if (gameSettings?.collectionImages) return gameSettings.collectionImages[0];
		return "";
	}, [gameSettings]);

	return (
		<body>
			<p className="font-sans w-full px-4 py-10 text-black text-center text-base gap-4">
				VoGuesser
			</p>
			<div className="flex justify-center">
				{gameSettings?.loading ? (
					<p>Loading...</p>
				) : (
					<div>
						<div className="flex justify-center">
							<p>{playBrands}</p>{" "}
						</div>

						<div className="flex justify-center">
							<p>{collectionSlugs}</p>{" "}
						</div>

						<div className="flex justify-center">
							<Image
								width={251}
								height={377}
								src={collectionImages}
								alt={"runway image"}
								placeholder="empty"
								// blurDataURL={}
							></Image>
						</div>
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
