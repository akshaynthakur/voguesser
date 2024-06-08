"use client";

// import { useWebDeviceDetection } from "@/context/WindowWidthContext";
import { useRouter } from "next/navigation";
import { fetchCollectionSlug, fetchImage } from "@/database/graphql";
import { useContext, useEffect, useMemo, useState } from "react";
import { useGameplay } from "@/context/GameplayContext";

export default function Home() {
	// const isWebDevice = useWebDeviceDetection();
	const gameplay = useGameplay();
	const router = useRouter();
	// const [result, setResult] = useState<string>("");

	// useEffect(() => {
	// 	fetchCollectionSlug("prada")
	// 		.then((result: string) => setResult(result))
	// 		.catch((e) => console.log(e));
	// 	// fetchImage("fall-2016-ready-to-wear/prada")
	// 	// 	.then((result: string) => setResult(result))
	// 	// 	.catch((e) => console.log("Error for fetch collection slug", e));
	// }, []);

	const collectionImages = useMemo(() => {
		if (gameplay) return gameplay.playBrands[0];
		return [":/"];
	}, [gameplay]);

	return (
		<body>
			<p className="font-sans w-full px-4 py-10 text-black text-center text-base gap-4">
				VoGuesser
			</p>
			<div className="flex justify-center">
				<p>{collectionImages}</p>
			</div>
			<div className="flex justify-center">
				<button
					onClick={() => router.push("/guess")}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Play
				</button>
			</div>
		</body>
	);
}
